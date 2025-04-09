# app/api/match.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_matcher import process_resume_and_match_jobs

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/match")
async def match_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")

    resume_bytes = await file.read()
    result = process_resume_and_match_jobs(resume_bytes)

    return result  # Contains matched jobs + word cloud data
