import traceback
import json
import numpy as np
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
import ollama

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

# Load SBERT (force CPU to avoid GPU mismatch)
model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# Improved: LLaMA re-ranking with matchReason
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

        return {
            "resume_skills": resume_skills,
            "matches": matches,
            "wordCloud": [
                {"text": skill, "value": resume_text.lower().count(skill.lower())}
                for skill in resume_skills
                if resume_text.lower().count(skill.lower()) > 0
            ]
        }

    except Exception as e:
        print("❌ Error in resume processing:", e)
        traceback.print_exc()
        raise  # re-raises for FastAPI to send 500 error in dev
