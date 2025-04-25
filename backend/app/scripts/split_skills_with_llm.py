# This script is used to clean up the skills field in the database by using a language model to parse and format the skills correctly.
import time
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from app.services.llm_skill_splitter import split_skills_with_llm

# Batch control
BATCH_SIZE = 100
SLEEP_SECONDS = 1.5
SLEEP_BETWEEN_BATCHES = 2.0

# Logging control
LOG_UPDATES = True
LOG_SKIPS = True

# Check if the skills field is in a dirty format
def is_dirty_skills_format(skills):
    return (
        isinstance(skills, str) and len(skills.strip()) > 0
    ) or (
        isinstance(skills, list) and len(skills) == 1 and isinstance(skills[0], str)
    )

# Function to split all existing skills in the database
def split_all_existing_skills():
    # Create a new session
    db: Session = SessionLocal()
    offset = 0
    total_updated = 0
    total_skipped = 0

    print("🔍 Starting skills cleanup using Ollama...")

    while True:
        # Fetch a batch of job postings
        jobs = (
            db.query(JobPosting)
            .offset(offset)
            .limit(BATCH_SIZE)
            .all()
        )

        # If no jobs are returned, break the loop
        if not jobs:
            break

        # Initialize counters for this batch
        updated = 0
        skipped = 0

        # Iterate through the jobs and check if the skills field is dirty
        for job in jobs:
            # If the skills field is in a dirty format, use the LLM to clean it
            if is_dirty_skills_format(job.skills):
                raw_text = job.skills[0] if isinstance(job.skills, list) else job.skills
                print(f"🔧 Fixing skills for job {job.id}...")

                # Use the LLM to split the skills
                fixed_skills = split_skills_with_llm(raw_text)

                # If the LLM returns a valid list of skills, update the job
                if fixed_skills:
                    job.skills = fixed_skills
                    db.add(job)
                    db.commit()
                    updated += 1
                    total_updated += 1
                    if LOG_UPDATES:
                        print(f"✅ Job {job.id} updated with {len(fixed_skills)} skills.")
                    time.sleep(SLEEP_SECONDS)
                else:
                    print(f"⚠️  LLM failed to parse job {job.id}")
            # If the skills field is already clean, skip the job
            else:
                skipped += 1
                total_skipped += 1
                if LOG_SKIPS:
                    print(f"⏩ Skipping job {job.id} — already clean.")

        offset += BATCH_SIZE
        print(f"🧊 Batch complete: {updated} updated, {skipped} skipped. Cooling down...")
        time.sleep(SLEEP_BETWEEN_BATCHES)

    db.close()
    print(f"\n🏁 Done! Total jobs updated: {total_updated}, skipped: {total_skipped}")

# Main function to run the script
if __name__ == "__main__":
    split_all_existing_skills()
