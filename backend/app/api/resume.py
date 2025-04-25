# This file defines the API routes for resume-related operations.
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_matcher import process_resume_and_match_jobs

# The router is created with a prefix and tags for organization.
router = APIRouter(prefix="/resume", tags=["Resume"])

# Define the API route for resume matching
@router.post("/match")
async def match_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"): # Check if the file is a PDF
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.") # Raise an error if not a PDF

    resume_bytes = await file.read() # Read the file content

    try:
        result = process_resume_and_match_jobs(resume_bytes) # Process the resume and match jobs
        return result # Return the matching jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {e}") # Raise an error if processing fails
