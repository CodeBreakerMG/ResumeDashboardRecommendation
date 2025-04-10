from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal
from app.schemas.job import JobOut, JobCreate, JobUpdate
from app.services import job_crud

router = APIRouter(prefix="/jobs", tags=["Jobs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[JobOut])
def list_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return job_crud.get_jobs(db, skip, limit)

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = job_crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/", response_model=JobOut)
def create_job(job_data: JobCreate, db: Session = Depends(get_db)):
    return job_crud.create_job(db, job_data)

@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, job_data: JobUpdate, db: Session = Depends(get_db)):
    job = job_crud.update_job(db, job_id, job_data)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.delete("/{job_id}", response_model=JobOut)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = job_crud.delete_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
