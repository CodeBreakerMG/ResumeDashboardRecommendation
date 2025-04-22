import ast
import traceback
import json
import re
import os
import numpy as np
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
from keybert import KeyBERT
from app.db.database import SessionLocal
from app.models.job import JobPosting
from dotenv import load_dotenv
import google.generativeai as genai
import ollama
from app.services.extract_skills import extract_skills
from wordcloud import WordCloud

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Models
embedding_model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
kw_model = KeyBERT(embedding_model)

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    import fitz
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()

def extract_resume_profile(text: str) -> dict:
    prompt = f"""
Extract a detailed resume profile in this JSON format:

{{
  "name": "Full Name",
  "totalYearsExperience": 4.5,
  "totalYearsEducation": 6,
  "latestExperienceTitle": "...",
  "latestEducationLevel": "Masters",
  "experienceByDomain": {{ "Data Science": 2, "Software": 3 }},
  "pastEmployers": ["Company A", "Company B"],
  "education": [...],
  "experience": [...],
  "industriesWorkedIn": ["..."],
  "publications": 2,
  "patents": 0
}}

Only return valid JSON. Do not add ```json or any extra formatting.

Resume:
{text}
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        content = response.text.strip()
        if content.startswith("```"):
            content = re.sub(r"^```[a-zA-Z]*", "", content).strip().rstrip("```").strip()
        return json.loads(content)
    except Exception as e:
        print(f"❌ Resume profile extraction failed: {e}")
        return {}

def extract_skills_with_gemini(text: str) -> list[str]:
    prompt = f"""
Extract only the professional skills from this resume as a valid Python list of strings.

Resume:
{text}

Return only the list. No explanation, no code block, no comments.
"""
    try:
        response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)
        return [s.lower().strip() for s in ast.literal_eval(response.text.strip()) if isinstance(s, str)]
    except Exception as e:
        print(f"❌ Gemini skill extraction failed: {e}")
        return []

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

def rank_with_gemini(resume_skills, resume_profile, job_snippets):
    prompt = f"""
You are an AI assistant evaluating job matches for a candidate.

Candidate Skills:
{', '.join(resume_skills)}

Candidate Profile:
{json.dumps(resume_profile, indent=2)}

Here are job postings:
{json.dumps(job_snippets, indent=2)}

Return up to 15 best matches as valid JSON list. Use this format:

[
  {{
    "jobId": 123,
    "matchReason": "Clear explanation of alignment",
    "matchedSkills": ["python", "sql"],
    "skillMatchPercent": 87.5,
    "industryMatchPercent": 100,
    "experienceMatchPercent": 75.0
  }},
  ...
]

Return ONLY the JSON array. No explanation or markdown.
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        content = response.text.strip()
        if content.startswith("```"):
            content = re.sub(r"^```[a-zA-Z]*", "", content).strip().rstrip("```").strip()
        return json.loads(content)
    except Exception as e:
        print("❌ Gemini rerank failed:", e)
        return []

def get_top_job_matches(resume_skills: list[str], resume_profile: dict, top_n: int = 10):
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.embedding != None).yield_per(100)

    resume_embedding = embedding_model.encode(", ".join(resume_skills), device="cpu", convert_to_tensor=True)
    scored_jobs = []

    for job in jobs:
        try:
            job_embedding = np.array(job.embedding, dtype=np.float32)
            score = util.cos_sim(resume_embedding, job_embedding).item()
            if score > 0.3:
                scored_jobs.append((score, job))
        except Exception as e:
            print(f"⚠️ Skipping job {job.id}: {e}")

    top_jobs = sorted(scored_jobs, key=lambda x: x[0], reverse=True)[:100]

    job_snippets = [{
        "jobId": job.id,
        "title": job.job_title or "",
        "company": job.company or "",
        "description": job.job_description or "",
        "skills": job.skills or [],
    } for _, job in top_jobs]

    ranked = rank_with_gemini(resume_skills, resume_profile, job_snippets)
    ranked_lookup = {entry["jobId"]: entry for entry in ranked if "jobId" in entry}

    final_jobs = []
    for score, job in top_jobs:
        match_info = ranked_lookup.get(job.id)
        if not match_info:
            continue

        final_jobs.append({
            "jobId": job.id,
            "experience": job.experience,
            "qualifications": job.qualifications,
            "salaryRange": job.salary_range,
            "location": job.location,
            "country": job.country,
            "latitude": job.latitude,
            "longitude": job.longitude,
            "workType": job.work_type,
            "companySize": job.company_size,
            "jobPostingDate": job.job_posting_date,
            "preference": job.preference,
            "contactPerson": job.contact_person,
            "contact": job.contact,
            "jobTitle": job.job_title,
            "role": job.role,
            "jobPortal": job.job_portal,
            "jobDescription": job.job_description,
            "benefits": job.benefits,
            "skills": job.skills,
            "responsibilities": job.responsibilities,
            "company": job.company,
            "companyProfile": job.company_profile,
            "matchScore": round(score, 2),
            "matchedSkills": match_info.get("matchedSkills", []),
            "matchReason": match_info.get("matchReason", ""),
            "skillMatchPercent": match_info.get("skillMatchPercent", 0),
            "industryMatchPercent": match_info.get("industryMatchPercent", 0),
            "experienceMatchPercent": match_info.get("experienceMatchPercent", 0),
        })

    db.close()
    return final_jobs[:top_n]

def parse_salary(text):
    try:
        return int(re.sub(r"[^\d]", "", text))
    except:
        return None

def get_salary_progression_trend(job_title: str):
    db = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.job_title == job_title).all()
    trends = {}

    for job in jobs:
        try:
            exp_range = re.findall(r'\d+', job.experience)
            if len(exp_range) == 2:
                mean_exp = (int(exp_range[0]) + int(exp_range[1])) / 2
            else:
                continue

            salary = job.salary_range.split("-")
            if len(salary) == 2:
                min_sal = parse_salary(salary[0])
                max_sal = parse_salary(salary[1])
                if min_sal is None or max_sal is None:
                    continue
                mean_salary = (min_sal + max_sal) / 2

                if mean_exp not in trends:
                    trends[mean_exp] = []
                trends[mean_exp].append(mean_salary)
        except:
            continue

    db.close()
    return {k: sum(v)/len(v) for k, v in trends.items()}

def get_salary_location_trend(job_title: str):
    db = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.job_title == job_title).all()
    trends = {}

    for job in jobs:
        try:
            salary = job.salary_range.split("-")
            if len(salary) == 2:
                min_sal = parse_salary(salary[0])
                max_sal = parse_salary(salary[1])
                if min_sal is None or max_sal is None:
                    continue
                mean_salary = (min_sal + max_sal) / 2

                if job.location not in trends:
                    trends[job.location] = []
                trends[job.location].append(mean_salary)
        except:
            continue

    db.close()
    for k in list(trends.keys()):
        if len(k) > 2:
            state = k[-2:]
            if state not in trends:
                trends[state] = []
            trends[state].extend(trends[k])
            del trends[k]
    return {k: sum(v)/len(v) for k, v in trends.items()}

def get_salary_trend(job_matches: list[dict]):
    titles = []
    for match in job_matches:
        if match["jobTitle"] not in titles:
            titles.append(match["jobTitle"])
    trend = {}
    for title in titles:
        trend[title] = {
            "progression": get_salary_progression_trend(title),
            "location": get_salary_location_trend(title)
        }
    return trend

def show_skills_wordcloud(skill_freq):
    wordcloud = WordCloud(
        width=1000,
        height=500,
        background_color=None,
        mode="RGBA",
        colormap="coolwarm",
        max_words=100,
        contour_color='steelblue',
        contour_width=2,
        max_font_size=150
    ).generate_from_frequencies(skill_freq)
    wordcloud.to_file("wordcloud.png")

def process_resume_and_match_jobs(pdf_bytes: bytes) -> dict:
    try:
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        resume_skills = extract_skills_with_gemini(resume_text)
        resume_profile = extract_resume_profile(resume_text)
        matches = get_top_job_matches(resume_skills, resume_profile)
        word_cloud_skills_freq = extract_skills(resume_text)
        salary_trend = get_salary_trend(matches)

        return {
            "resume_skills": resume_skills,
            "matches": matches,
            "word_cloud_skills_freq": word_cloud_skills_freq,
            "salaryTrend": salary_trend,
            "resumeProfile": resume_profile
        }
    except Exception as e:
        print("❌ Error in resume processing:", e)
        traceback.print_exc()
        raise
