
# 📄 Resume Recommendation Tool (FastAPI + Ollama + Embeddings)

This project is a resume-to-job matching system built with **FastAPI**, **Ollama (LLM)**, **SBERT embeddings**, and a local **SQLite** database of job listings. It allows users to upload a PDF resume and returns the top job matches, complete with a match score, matched skills, and match reason.

---

## 🚀 Features

- ✅ PDF resume parsing with `PyMuPDF`
- ✅ Skill extraction using Ollama (LLaMA/Mistral)
- ✅ Job embeddings with SentenceTransformers (SBERT)
- ✅ Hybrid ranking with embeddings + LLaMA for match reason
- ✅ Word cloud generation
- ✅ Full CRUD for jobs via FastAPI
- ✅ Docker-ready for deployment

---

## 🧱 Project Structure

```
backend/
├── app/
│   ├── api/                 # FastAPI routes
│   ├── db/                  # SQLAlchemy database setup
│   ├── models/              # ORM models
│   ├── schemas/             # Pydantic models
│   ├── scripts/             # Data loaders and utilities
│   └── services/            # Business logic (matcher, parser, etc.)
├── alembic/                 # Database migrations
├── app.db                   # SQLite database (not included in Docker image)
├── requirements.txt
├── Dockerfile
```

---

## 🧪 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-recommendation-tool.git
cd resume-recommendation-tool/backend
```

### 2. Set Up Environment

Use `venv` or `conda`. Example with `venv`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 3. Run the API with Uvicorn

```bash
uvicorn app.main:app --reload
```

> The API will be available at http://127.0.0.1:8000

You can now upload resumes via `/docs` or use Postman/your frontend.

> ⚠️ Make sure **Ollama** is running locally (`ollama serve`)

---

## 🐳 Docker Deployment

### 1. Build Docker Image

```bash
docker build -t resume-api .
```

### 2. Run with SQLite DB Mounted

```bash
docker run -it --rm   -v /path/to/resumeapp.db:/app/app.db   -p 8000:8000   resume-api
```

Or if using **local Ollama**, use host networking:

```bash
docker run -it --rm   --network host   -v /path/to/resumeapp.db:/app/app.db   -p 8000:8000   resume-api
```

### 3. Enable Auto-Restart on Reboots

```bash
docker run -d   --restart unless-stopped   --network host   -v /home/ubuntu/resumeapp.db:/app/app.db   -p 8000:8000   resume-api
```

---

## 🔗 API Endpoint

### `POST /resume/match`

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` → your `.pdf` resume

**Response:**

```json
{
  "resume_skills": [...],
  "matches": [
    {
      "jobId": 123,
      "matchScore": 0.78,
      "matchedSkills": [...],
      "matchReason": "Mentions Java and CI/CD, which align with this job."
    }
  ],
  "wordCloud": [
    { "text": "python", "value": 5 },
    ...
  ]
}
```

---

## 🧠 Matching Logic

1. Extracts text from PDF using `PyMuPDF`
2. Skills are extracted using a local LLM via Ollama
3. Skills are embedded using SBERT (MiniLM)
4. Compared to job embeddings using cosine similarity
5. Top jobs are re-ranked with Mistral and a match reason is generated

---

## ⚠️ Notes

- The database (`app.db`) is **not included in the Docker image**
- Make sure **Ollama** is installed and running (`ollama serve`)
- Word clouds use extracted skills and frequency from the full resume

---

## 📚 License

MIT License
