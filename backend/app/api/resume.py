from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services import parser

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()

    if file.filename.endswith(".pdf"):
        text = parser.extract_text_from_pdf(contents)
    elif file.filename.endswith(".docx"):
        text = parser.extract_text_from_docx(contents)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    skills = parser.parse_skills(text)
    return {
        "filename": file.filename,
        "extracted_skills": skills
    }