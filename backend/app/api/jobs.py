# This file defines the API routes for job-related operations.
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal
from app.schemas.job import JobOut, JobCreate, JobUpdate
from app.services import job_crud

# The router is created with a prefix and tags for organization.
router = APIRouter(prefix="/jobs", tags=["Jobs"])

# Dependency to get the database session
def get_db():
    db = SessionLocal() # Create a new session
    try:
        yield db # Yield the session to the route handler
    finally:
        db.close() # Close the session after use

# Define the API routes for job operations
@router.get("/", response_model=List[JobOut])
def list_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return job_crud.get_jobs(db, skip, limit) # List all jobs with pagination

# Get a specific job by ID
@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = job_crud.get_job(db, job_id) # Retrieve a job by its ID
    if not job:
        raise HTTPException(status_code=404, detail="Job not found") # Raise an error if not found
    return job # Return the job details

# Create a new job
@router.post("/", response_model=JobOut)
def create_job(job_data: JobCreate, db: Session = Depends(get_db)):
    return job_crud.create_job(db, job_data) # Create a new job with the provided data

# Update an existing job
@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, job_data: JobUpdate, db: Session = Depends(get_db)):
    job = job_crud.update_job(db, job_id, job_data) # Update a job with the provided data
    if not job:
        raise HTTPException(status_code=404, detail="Job not found") # Raise an error if not found
    return job # Return the updated job details

# Delete a job by ID
@router.delete("/{job_id}", response_model=JobOut)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = job_crud.delete_job(db, job_id) # Delete a job by its ID
    if not job:
        raise HTTPException(status_code=404, detail="Job not found") # Raise an error if not found
    return job # Return the deleted job details
