import traceback
import json
import numpy as np
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
from keybert import KeyBERT
from app.db.database import SessionLocal
from app.models.job import JobPosting
import ollama

# Models
model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
kw_model = KeyBERT(model)

# PDF parsing
def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    import fitz
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()

# Use Ollama to extract skills from resume text
def extract_skills_from_text(text: str) -> list[str]:
    prompt = f"""
You are a resume assistant. Extract a list of relevant professional skills from this resume.

Return ONLY a Python list of strings — no explanation.

{text}
"""
    try:
        response = ollama.chat(
            model='mistral',
            messages=[{"role": "user", "content": prompt}]
        )
        skills = eval(response['message']['content'].strip())
        return [s.lower().strip() for s in skills if isinstance(s, str)]
    except Exception as e:
        print(f"❌ Error extracting skills from LLM: {e}")
        return []

# Better word cloud with KeyBERT
def extract_keywords_for_wordcloud(text: str, top_n: int = 25):
    try:
        keywords = kw_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 3),
            stop_words="english",
            top_n=top_n
        )
        return [{"text": kw, "value": int(score * 100)} for kw, score in keywords]
    except Exception as e:
        print("❌ Error extracting word cloud keywords:", e)
        return []

# LLaMA Re-ranking with reasoning
def rank_with_llama_with_reason(resume_skills, job_snippets):
    prompt = f"""
You are a helpful job matching assistant. A candidate has these skills:

{', '.join(resume_skills)}

Here are job postings (each with jobId and description):

{json.dumps(job_snippets)}

Rank the jobs by best fit to the candidate and explain why.

⚠️ Return ONLY valid JSON, like:

[
  {{
    "jobId": 123,
    "matchReason": "Mentions Python, AWS, and CI/CD which match the resume."
  }},
  ...
]

Do NOT include anything outside the JSON list. No explanations. Just JSON.
"""
    response = ollama.chat(
        model="mistral",
        messages=[{"role": "user", "content": prompt}]
    )

    print("🧠 LLaMA raw response:\n", response['message']['content'])  # Debug print

    try:
        return json.loads(response['message']['content'])
    except Exception as e:
        print(f"❌ Error parsing LLaMA response: {e}")
        return []
    
def get_salary_progression_trend(job_title: str):
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.job_title == job_title).all()

    matching_jobs = {}

    for job in jobs:
        if job.job_title == job_title:
            experience = job.experience.split("to")
            if len(experience) == 2:
                min_exp = int(experience[0].strip())
                max_exp = int(experience[1].strip())
                mean_exp = (min_exp + max_exp) / 2

            salary = job.salary_range.split("-")
            if len(salary) == 2:
                min_salary = int(salary[0].replace("$", "").replace("k", "").strip())
                max_salary = int(salary[1].replace("$", "").replace("k", "").strip())
                mean_salary = (min_salary + max_salary) / 2
            
            if mean_exp not in matching_jobs:
                matching_jobs[mean_exp] = [mean_salary]
            else:
                matching_jobs[mean_exp].append(mean_salary)
            # calculate the mean of the salaries for that experience
            matching_jobs[mean_exp] = sum(matching_jobs[mean_exp]) / len(matching_jobs[mean_exp])
    db.close()

    return matching_jobs   

def get_salary_location_trend(job_title: str):
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.job_title == job_title).all()

    matching_jobs = {}

    for job in jobs:
        if job.job_title == job_title:
            salary = job.salary_range.split("-")
            if len(salary) == 2:
                min_salary = int(salary[0].replace("$", "").replace("k", "").strip())
                max_salary = int(salary[1].replace("$", "").replace("k", "").strip())
                mean_salary = (min_salary + max_salary) / 2
            
            if job.location not in matching_jobs:
                matching_jobs[job.location] = [mean_salary]
            else:
                matching_jobs[job.location].append(mean_salary)
            # calculate the mean of the salaries for that location
            matching_jobs[job.location] = sum(matching_jobs[job.location]) / len(matching_jobs[job.location])
    db.close()

    return matching_jobs 

def get_salary_trend(job_matches: list[dict]):
    top_job_titles = []
    for match in job_matches:
        if match["jobTitle"] not in top_job_titles:
            top_job_titles.append(match["jobTitle"])
        if len(top_job_titles) >= 3:
            break

    salary_trend = {}
    for job_title in top_job_titles:
        salary_progression_trend = get_salary_progression_trend(job_title)
        salary_location_trend = get_salary_location_trend(job_title)

        salary_trend[job_title]["progression"] = salary_progression_trend
        salary_trend[job_title]["location"] = salary_location_trend
        
    return salary_trend

# Match resume skills with job postings
def get_top_job_matches(resume_skills: list[str], top_n: int = 10):
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.embedding != None).yield_per(100)

    resume_embedding = model.encode(", ".join(resume_skills), device="cpu", convert_to_tensor=True)
    scored_jobs = []

    for job in jobs:
        try:
            job_embedding = np.array(job.embedding, dtype=np.float32)
            score = util.cos_sim(resume_embedding, job_embedding).item()
            if score > 0.3:
                scored_jobs.append((score, job))
        except Exception as e:
            print(f"⚠️ Skipping job {job.id}: {e}")

    # Sort top matches by score
    top_jobs = sorted(scored_jobs, key=lambda x: x[0], reverse=True)[:100]

    job_snippets = [{
        "jobId": job.id,
        "description": job.job_description or "",
        "skills": job.skills or [],
        "title": job.job_title or "",
        "company": job.company or "",
    } for _, job in top_jobs]

    llama_results = rank_with_llama_with_reason(resume_skills, job_snippets)
    reason_lookup = {entry["jobId"]: entry["matchReason"] for entry in llama_results}

    final_jobs = []
    for score, job in top_jobs:
        if job.id not in reason_lookup:
            continue
        final_jobs.append({
            "jobId": job.id,
            "jobTitle": job.job_title,
            "company": job.company,
            "location": job.location,
            "latitude": job.latitude,
            "longitude": job.longitude,
            "experience": job.experience,
            "jobDescription": job.job_description,
            "skills": job.skills,
            "benefits": job.benefits,
            "responsibilities": job.responsibilities,
            "salaryRange": job.salary_range,
            "companyProfile": job.company_profile,
            "matchScore": round(score, 2),
            "matchedSkills": list(set(resume_skills) & set(job.skills or [])),
            "matchReason": reason_lookup[job.id]
        })

    db.close()
    return final_jobs[:top_n]

# Main pipeline
def process_resume_and_match_jobs(pdf_bytes: bytes) -> dict:
    try:
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        resume_skills = extract_skills_from_text(resume_text)
        matches = get_top_job_matches(resume_skills)
        word_cloud = extract_keywords_for_wordcloud(resume_text)
        salary_trend = get_salary_trend(matches)
        
        return {
            "resume_skills": resume_skills,
            "matches": matches,
            "wordCloud": word_cloud,
            "salaryTrend": salary_trend
        }

    except Exception as e:
        print("❌ Error in resume processing:", e)
        traceback.print_exc()
        raise
