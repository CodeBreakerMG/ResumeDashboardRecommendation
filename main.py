from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import pymupdf
import numpy as np
import os
from resume_parser import extract_resume_info

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    with pymupdf.open(file_path) as doc:
        text = "\n".join([page.get_text() for page in doc])
    
    resume_data = extract_resume_info(text)

    return JSONResponse(content=resume_data)

@app.get("/wordcloud")
async def get_wordcloud():
    """
    Serve the generated WordCloud image.
    """
    return FileResponse("wordcloud.png", media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# uvicorn main:app --reload