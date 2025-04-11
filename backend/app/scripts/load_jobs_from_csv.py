import ast

import pandas as pd
from sqlalchemy.orm import Session

from app.db.database import engine, SessionLocal
from app.models.job import JobPosting
from app.services.parser import smart_split_skills

CHUNK_SIZE = 10000  # Adjust based on your RAM

def parse_company_profile(raw):
    try:
        return ast.literal_eval(raw)
    except Exception:
        return {}

def parse_benefits(raw):
    try:
        # Remove outer quotes and brackets if present
        clean = raw.strip().strip("{}\"'")
        return [b.strip() for b in clean.split(",") if b.strip()]
    except Exception:
        return []

def process_chunk(chunk: pd.DataFrame, db: Session):
    for _, row in chunk.iterrows():
        try:
            job = JobPosting(
                id=int(row['Job Id']),
                experience=row.get('Experience'),
                qualifications=row.get('Qualifications'),
                salary_range=row.get('Salary Range'),
                location=row.get('location'),
                country=row.get('Country'),
                latitude=float(row.get('latitude', 0.0)),
                longitude=float(row.get('longitude', 0.0)),
                work_type=row.get('Work Type'),
                company_size=int(row.get('Company Size', 0)),
                job_posting_date=pd.to_datetime(row.get('Job Posting Date'), errors='coerce').date(),
                preference=row.get('Preference'),
                contact_person=row.get('Contact Person'),
                contact=row.get('Contact'),
                job_title=row.get('Job Title'),
                role=row.get('Role'),
                job_portal=row.get('Job Portal'),
                job_description=row.get('Job Description'),
                benefits=parse_benefits(row.get('Benefits', '')),
                skills=smart_split_skills(row.get('skills', '')),
                responsibilities=row.get('Responsibilities'),
                company=row.get('Company'),
                company_profile=parse_company_profile(row.get('Company Profile', '{}')),
            )
            db.merge(job)
        except Exception as e:
            print(f"Failed on row {row.get('Job Id')}: {e}")
            continue

    db.commit()

def load_jobs_from_csv(csv_path: str):
    db = SessionLocal()
    chunks = pd.read_csv(csv_path, chunksize=CHUNK_SIZE)

    for i, chunk in enumerate(chunks):
        print(f"Processing chunk {i+1}")
        process_chunk(chunk, db)

    db.close()

if __name__ == "__main__":
    from app.db.database import Base
    Base.metadata.create_all(bind=engine)
    load_jobs_from_csv("data/jobs.csv")  # Replace with your path
