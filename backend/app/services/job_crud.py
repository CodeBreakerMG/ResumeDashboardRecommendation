from sqlalchemy.orm import Session
from app.models.job import JobPosting
from app.schemas.job import JobCreate, JobUpdate

def get_job(db: Session, job_id: int):
    return db.query(JobPosting).filter(JobPosting.id == job_id).first()

def get_jobs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(JobPosting).offset(skip).limit(limit).all()

def create_job(db: Session, job_data: JobCreate):
    job = JobPosting(**job_data.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def update_job(db: Session, job_id: int, job_data: JobUpdate):
    job = get_job(db, job_id)
    if not job:
        return None
    for field, value in job_data.dict(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job

def delete_job(db: Session, job_id: int):
    job = get_job(db, job_id)
    if not job:
        return None
    db.delete(job)
    db.commit()
    return job
