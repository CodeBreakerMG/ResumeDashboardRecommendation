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

def is_dirty_skills_format(skills):
    return (
        isinstance(skills, str) and len(skills.strip()) > 0
    ) or (
        isinstance(skills, list) and len(skills) == 1 and isinstance(skills[0], str)
    )

def split_all_existing_skills():
    db: Session = SessionLocal()
    offset = 0
    total_updated = 0
    total_skipped = 0

    print("🔍 Starting skills cleanup using Ollama...")

    while True:
        jobs = (
            db.query(JobPosting)
            .offset(offset)
            .limit(BATCH_SIZE)
            .all()
        )

        if not jobs:
            break

        updated = 0
        skipped = 0

        for job in jobs:
            if is_dirty_skills_format(job.skills):
                raw_text = job.skills[0] if isinstance(job.skills, list) else job.skills
                print(f"🔧 Fixing skills for job {job.id}...")

                fixed_skills = split_skills_with_llm(raw_text)

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

if __name__ == "__main__":
    split_all_existing_skills()
