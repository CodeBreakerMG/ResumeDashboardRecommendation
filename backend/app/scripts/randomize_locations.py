from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from app.scripts.location_utils import get_random_location

# This script randomizes the location of job postings in the database.
def randomize_locations():
    # Connect to the database
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).all()
    updated = 0

    # Iterate through all job postings
    for job in jobs:
        # Generate a random location
        loc = get_random_location()
        # Update the job posting with the new location
        job.location = f"{loc['city']}, {loc['state']}"
        job.latitude = loc['lat']
        job.longitude = loc['lng']
        # Add the updated job posting to the session
        db.add(job)
        updated += 1
        print(f"📍 Updated job {job.id} → {job.location} ({job.latitude}, {job.longitude})")

    # Commit the changes to the database
    db.commit()
    db.close()
    print(f"✅ Finished updating {updated} jobs.")

# This is the entry point for the script. It will be executed when the script is run directly.
if __name__ == "__main__":
    randomize_locations()
