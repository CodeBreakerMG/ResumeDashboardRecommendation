import fitz
import ollama
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting

# PDF parsing
def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
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
            "job_id": job.id,
            "job_title": job.job_title,
            "company": job.company,
            "location": job.location,
            "match_score": round(score, 2),
            "matched_skills": list(set(resume_skills) & set(job.skills)),
            "job_skills": job.skills,
        })

    db.close()
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_jobs[:top_n]

# Main processing pipeline
def process_resume_and_match_jobs(pdf_bytes: bytes) -> dict:
    resume_text = extract_text_from_pdf_bytes(pdf_bytes)
    resume_skills = extract_skills_from_text(resume_text)
    matches = get_top_job_matches(resume_skills)

    # Optionally include word cloud data
    word_freq = {skill: resume_text.lower().count(skill) for skill in resume_skills}

    return {
        "resume_skills": resume_skills,
        "matches": matches,
        "word_cloud": word_freq,
    }
