from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from app.scripts.location_utils import get_random_location

def randomize_locations():
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).all()
    updated = 0

    for job in jobs:
        loc = get_random_location()
        job.location = f"{loc['city']}, {loc['state']}"
        job.latitude = loc['lat']
        job.longitude = loc['lng']
        db.add(job)
        updated += 1
        print(f"📍 Updated job {job.id} → {job.location} ({job.latitude}, {job.longitude})")

    db.commit()
    db.close()
    print(f"✅ Finished updating {updated} jobs.")

if __name__ == "__main__":
    randomize_locations()
