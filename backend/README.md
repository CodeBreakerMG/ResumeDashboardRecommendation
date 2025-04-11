# 📄 Resume Recommendation Tool (FastAPI + Ollama + Embeddings)

This project is a resume-to-job matching system built with **FastAPI**, **Ollama (LLM)**, **SBERT embeddings**, and a local **SQLite** database of job listings. It allows users to upload a PDF resume and returns the top job matches, complete with a match score, matched skills, and match reason.

---

## 🚀 Features

- ✅ PDF resume parsing with `PyMuPDF`
- ✅ Skill extraction using Ollama (LLaMA/Mistral)
- ✅ Job embeddings with SentenceTransformers (SBERT)
- ✅ Hybrid ranking with embeddings + LLaMA for match reason
- ✅ Word cloud data output
- ✅ Job CRUD via FastAPI
- ✅ Dockerized for easy deployment

---

## 🧱 Project Structure

```
backend/
├── app/
│   ├── api/                 # FastAPI routes
│   ├── db/                  # SQLAlchemy database setup
│   ├── models/              # ORM models
│   ├── schemas/             # Pydantic models
│   ├── scripts/             # Data loaders and utils
│   └── services/            # Business logic (matcher, parser, etc.)
├── alembic/                 # Database migrations
├── app.db                   # SQLite database (mounted, not in Docker image)
├── requirements.txt
├── Dockerfile
```

---

## 🐳 Docker Setup

### Build the image

```bash
docker build -t resume-api .
```

### Run with mounted database

```bash
docker run -it --rm \
  -v /path/to/resumetool.db:/app/app.db \
  -p 8000:8000 \
  resume-api
```

> You can also use `--network host` if connecting to a local Ollama instance.

---

## 📥 API Endpoint

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

- Uses **SBERT** to get resume/job embeddings
- Uses **cosine similarity** for initial filtering
- Then **Ollama** ranks top 100 jobs and explains why each one fits

---

## 🧪 Development

- Launch locally with `uvicorn app.main:app --reload`
- Use Postman or your frontend to hit `/resume/match`

---

## ⚠️ Notes

- The SQLite DB is ~3 GB — it is **not included in the image**
- Ollama must be running locally (`ollama serve`)
- You can scale this with Docker Compose or cloud hosting

---

## 📚 License

MIT License
---

## 🐳 Full Docker Deployment Guide

### 1. Clone and Build

```bash
git clone https://github.com/your-username/resume-recommendation-tool.git
cd resume-recommendation-tool/backend
docker build -t resume-api .
```

### 2. Run the Container with External SQLite DB

```bash
docker run -it --rm \
  -v /home/ubuntu/resumetool.db:/app/app.db \
  -p 8000:8000 \
  resume-api
```

> Replace `/home/ubuntu/resumetool.db` with the absolute path to your real database.

### 3. Connect to Local Ollama (LLM)

To allow the Docker container to access your local Ollama server (default `localhost:11434`):

- Make sure `ollama serve` is running on your host
- Use `--network host` to allow full access:

```bash
docker run -it --rm \
  --network host \
  -v /home/ubuntu/resumetool.db:/app/app.db \
  -p 8000:8000 \
  resume-api
```

**Or**, on Linux, add this to your `/etc/hosts` if needed:

```
127.0.0.1 host.docker.internal
```

Then inside your app, connect to `http://host.docker.internal:11434` to reach Ollama.

---

### ✅ Optional: Docker Compose Example

You can create a `docker-compose.yml`:

```yaml
version: "3.9"

services:
  resume_api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - /home/ubuntu/resumetool.db:/app/app.db
    restart: unless-stopped
```

Then:

```bash
docker-compose up --build
```

---
