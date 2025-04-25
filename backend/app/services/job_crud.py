# This module contains CRUD operations for job postings.
from sqlalchemy.orm import Session
from app.models.job import JobPosting
from app.schemas.job import JobCreate, JobUpdate

# Methods for CRUD operations
# Get a job by ID
def get_job(db: Session, job_id: int):
    return db.query(JobPosting).filter(JobPosting.id == job_id).first()

# Get all jobs with pagination
def get_jobs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(JobPosting).offset(skip).limit(limit).all()

# Create a new job
def create_job(db: Session, job_data: JobCreate):
    job = JobPosting(**job_data.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

# Update an existing job
def update_job(db: Session, job_id: int, job_data: JobUpdate):
    job = get_job(db, job_id)
    if not job:
        return None
    for field, value in job_data.dict(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job

# Delete a job
def delete_job(db: Session, job_id: int):
    job = get_job(db, job_id)
    if not job:
        return None
    db.delete(job)
    db.commit()
    return job
