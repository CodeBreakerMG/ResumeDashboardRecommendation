# This script loads job postings from a CSV file into a database.
import ast
import json
import html
import pandas as pd
from sqlalchemy.orm import Session

from app.db.database import engine, SessionLocal
from app.models.job import JobPosting
from app.services.parser import smart_split_skills

# Define the chunk size for reading the CSV file
CHUNK_SIZE = 10000

def parse_company_profile(raw):
    try:
        cleaned = html.unescape(raw.strip())
        return ast.literal_eval(cleaned)
    except Exception:
        return {}

def parse_benefits(raw):
    try:
        return json.loads(raw) if isinstance(raw, str) else []
    except Exception:
        return []

def clean_skills(raw):
    try:
        parsed = json.loads(raw) if isinstance(raw, str) else []
        return [s.strip() for s in parsed if isinstance(s, str)]
    except Exception:
        return []

# Function to process each chunk of the DataFrame
def process_chunk(chunk: pd.DataFrame, db: Session):
    for _, row in chunk.iterrows():
        try:
            # Clean and parse the data
            job = JobPosting(
                id=int(row['id']),
                experience=row.get('experience'),
                qualifications=row.get('qualifications'),
                salary_range=row.get('salary_range'),
                location=row.get('location'),
                country=row.get('country'),
                latitude=float(row.get('latitude', 0.0)),
                longitude=float(row.get('longitude', 0.0)),
                work_type=row.get('work_type'),
                company_size=int(row.get('company_size', 0)),
                job_posting_date=pd.to_datetime(row.get('job_posting_date'), errors='coerce').date(),
                preference=row.get('preference'),
                contact_person=row.get('contact_person'),
                contact=row.get('contact'),
                job_title=row.get('job_title'),
                role=row.get('role'),
                job_portal=row.get('job_portal'),
                job_description=html.unescape(row.get('job_description', '')),
                benefits=parse_benefits(row.get('benefits', '')),
                skills=clean_skills(row.get('skills', '')),
                responsibilities=html.unescape(row.get('responsibilities', '')),
                company=row.get('company'),
                company_profile=parse_company_profile(row.get('company_profile', '{}')),
            )
            db.merge(job)
        except Exception as e:
            print(f"Failed on row {row.get('id')}: {e}")
            continue
    # Commit the changes to the database
    db.commit()

# Function to load jobs from a CSV file
def load_jobs_from_csv(csv_path: str):
    db = SessionLocal() # Create a new session
    # Read the CSV file in chunks
    chunks = pd.read_csv(csv_path, chunksize=CHUNK_SIZE)

    # Process each chunk
    for i, chunk in enumerate(chunks):
        print(f"Processing chunk {i+1}")
        process_chunk(chunk, db)

    # Close the database session
    db.close()

# Main function to run the script
if __name__ == "__main__":
    from app.db.database import Base
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    # Load jobs from the CSV file
    load_jobs_from_csv("data/jobs-manuel.csv")  # Replace with your path
