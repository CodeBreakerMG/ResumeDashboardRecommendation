import pandas as pd
import json
import numpy as np
from faker import Faker
from datetime import datetime
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
import ollama
from app.db.database import SessionLocal
from app.models.job import JobPosting

# ---------------------- CONFIG ----------------------
CSV_PATH = "data/postings.csv"
START_ROW = 10
END_ROW = 1000  # Adjust for batch size

fake = Faker()
embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
df = pd.read_csv(CSV_PATH).iloc[START_ROW:END_ROW].copy()


# ---------------------- HELPERS ----------------------
def extract_mistral(prompt: str):
    try:
        res = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
        return res['message']['content'].strip()
    except Exception as e:
        print(f"❌ Mistral error: {e}")
        return ""


def extract_skills_mistral(description: str) -> list[str]:
    prompt = f"""Extract a comma-separated list of lowercase professional skill keywords from this job description:

{description}

Return only a single line like: python, sql, communication, azure, docker
"""
    try:
        raw = extract_mistral(prompt)
        skills = [s.strip().lower() for s in raw.split(",") if s.strip()]
        return skills
    except Exception as e:
        print(f"⚠️ Skill parse error: {e}")
        return []


def normalize_salary(min_sal, max_sal) -> str:
    try:
        min_val = int(min_sal)
        max_val = int(max_sal)
        if min_val < 1000: min_val *= 1000
        if max_val < 1000: max_val *= 1000
        return f"${min_val // 1000}K-${max_val // 1000}K"
    except:
        return "$50K-$100K"


def safe_timestamp(ts) -> datetime:
    try:
        return datetime.fromtimestamp(float(ts) / 1000.0)
    except:
        return datetime.now()


# ---------------------- DB INSERT ----------------------
db: Session = SessionLocal()
for _, row in df.iterrows():
    try:
        job_id = int(row["job_id"])
        experience = "2 to 8 Years"
        qualifications = row.get("skills_desc") or ""
        salary_range = normalize_salary(row.get("min_salary", 0), row.get("max_salary", 0))
        location = row.get("location", "")
        country = "USA"
        lat, lon = 0.0, 0.0
        work_type = str(row.get("work_type", "Full-Time")).replace("_", " ").capitalize()
        company_size = int(row["views"]) if pd.notnull(row["views"]) else 100
        job_posting_date = safe_timestamp(row.get("listed_time"))
        preference = fake.random_element(["Male", "Female", "Both"])
        contact_person = fake.name()
        contact = fake.phone_number()
        job_title = row.get("title", "Unknown")
        job_description = row.get("description", "")
        role = extract_mistral(f"What is the role title for this job?\n\n{job_description}")
        job_portal = "LinkedIn"
        benefits = ["Health Insurance", "Retirement Plan", "Flexible Schedule"]
        skills = extract_skills_mistral(job_description)
        responsibilities = extract_mistral(f"Summarize the main job responsibilities for:\n\n{job_description}")
        company = row.get("company_name", "Unknown")

        city = location.split(",")[0].strip() if "," in location else location
        state = location.split(",")[1].strip() if "," in location else "N/A"
        company_profile = {
            "Sector": "Unknown",
            "Industry": "Unknown",
            "City": city,
            "State": state,
            "Website": "N/A",
            "Ticker": "",
            "CEO": fake.name()
        }

        embedding = embedder.encode(", ".join(skills)).tolist() if skills else None

        job = JobPosting(
            id=job_id,
            experience=experience,
            qualifications=qualifications,
            salary_range=salary_range,
            location=location,
            country=country,
            latitude=lat,
            longitude=lon,
            work_type=work_type,
            company_size=company_size,
            job_posting_date=job_posting_date,
            preference=preference,
            contact_person=contact_person,
            contact=contact,
            job_title=job_title,
            role=role,
            job_portal=job_portal,
            job_description=job_description,
            benefits=benefits,
            skills=skills,
            responsibilities=responsibilities,
            company=company,
            company_profile=company_profile,
            embedding=embedding
        )

        db.add(job)
        db.commit()
        print(f"✅ Inserted job {job_id}")
    except Exception as e:
        db.rollback()
        print(f"❌ Failed to insert job {row.get('job_id')}: {e}")

db.close()
print("🎉 Done importing!")
