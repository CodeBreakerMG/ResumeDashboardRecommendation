import pandas as pd
import time
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from app.services.llm_skill_splitter import split_skills_with_llm  # or use your Ollama matcher

def load_secondary_dataset(csv_path: str, max_jobs: int = 500):
    df = pd.read_csv(csv_path)

    # Clean salary (optional - based on your colleague's suggestion)
    df['salary'] = df['salary'].replace(286497.1164575069, 0)
    df = df.fillna("")  # Avoid NaN crashes

    db: Session = SessionLocal()
    inserted = 0

    for _, row in df.iterrows():
        if inserted >= max_jobs:
            print(f"🛑 Limit reached: {inserted} jobs loaded.")
            break

        skills_blob = row['skills_desc'].strip()
        if not skills_blob:
            # No pre-listed skills → extract them from description
            skills_blob = row['description']

        skills = split_skills_with_llm(skills_blob)

        job = JobPosting(
            id=None,  # Let SQLite autogenerate ID
            company=row['company_name'],
            job_title=row['title'],
            job_description=row['description'],
            salary_range=str(row['salary']),  # convert to string for consistency
            location=row['location'],
            experience=row['formatted_experience_level'],
            work_type=row['work_type'],
            skills=skills
        )

        db.add(job)
        db.commit()
        inserted += 1
        print(f"✔️  Added job {inserted}: {job.job_title} @ {job.company}")
        time.sleep(1.2)  # to protect CPU if using Ollama

    db.close()
    print(f"✅ Finished loading {inserted} new jobs.")

if __name__ == "__main__":
    load_secondary_dataset("data/new_dataset.csv")
