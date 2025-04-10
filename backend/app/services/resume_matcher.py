import ollama
from sqlalchemy.orm import Session
import traceback
from app.db.database import SessionLocal
from app.models.job import JobPosting


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


# Match resume skills with job postings
def get_top_job_matches(resume_skills: list[str], top_n: int = 10) -> list[dict]:
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).yield_per(100)

    scored_jobs = []

    for job in jobs:
        if not isinstance(job.skills, list) or not job.skills:
            continue

        match_count = len(set(resume_skills) & set(job.skills))
        if match_count == 0:
            continue

        score = match_count / len(job.skills)

        scored_jobs.append({
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
            "matchedSkills": list(set(resume_skills) & set(job.skills))
        })

    db.close()
    scored_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
    return scored_jobs[:top_n]


# Main processing pipeline
def process_resume_and_match_jobs(pdf_bytes: bytes) -> dict:
    try:
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        resume_skills = extract_skills_from_text(resume_text)
        matches = get_top_job_matches(resume_skills)

        word_freq = {skill: resume_text.lower().count(skill) for skill in resume_skills}

        return {
            "resume_skills": resume_skills,
            "matches": matches,
            "wordCloud": [
                {"text": k, "value": v}
                for k, v in word_freq.items()
                if v > 0
            ]
        }

    except Exception as e:
        print("❌ Error in resume processing:", e)
        traceback.print_exc()
        raise  # so FastAPI returns 500 with stack trace in dev
