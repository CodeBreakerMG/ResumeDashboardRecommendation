# 📄 Smart Resume Parser (FastAPI + Gemini + Embeddings)

This project is a resume-to-job matching system built with **FastAPI**, **Google Gemini (LLM)**, **SBERT embeddings (MiniLM)**, and a local **SQLite** database of job listings. It allows users to upload a PDF resume and returns the top job matches, complete with a match score, matched skills, and match reason.

---

## 🚀 Features

- ✅ PDF resume parsing with `PyMuPDF`
- ✅ Skill extraction using **Gemini (LLM)** with **Mistral fallback via Ollama**
- ✅ Job embeddings using **SentenceTransformers (MiniLM)**
- ✅ Hybrid matching: SBERT cosine similarity + Gemini for re-ranking with match reasons
- ✅ Word cloud generation for visual insights
- ✅ Full CRUD for job postings via FastAPI
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
│   └── services/            # Business logic (matcher, parser, skill extractor, etc.)
├── alembic/                 # Database migrations
├── app.db                   # SQLite database (not included in Docker image)
├── requirements.txt
├── Dockerfile
```

---

## 🧪 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/CodeBreakerMG/ResumeDashboardRecommendation.git
cd ResumeDashboardRecommendation/backend
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

---

## ⚙️ Environment Setup

- Add your Gemini API key in a `.env` file:

```env
GEMINI_API_KEY=your-key-here
```

- Ollama is only required as a **fallback**, but can be useful for:
  - Skill extraction if Gemini fails
  - Responsibility or role generation

Make sure it's running locally (`ollama serve`) if fallback logic is enabled.

---

## 🐳 Docker Deployment

### 1. Build Docker Image

```bash
docker build -t resume-api .
```

### 2. Run with SQLite DB Mounted

```bash
docker run -it --rm   -v /path/to/app.db:/app/app.db   -p 8000:8000 resume-api
```

### 3. Use Local Ollama (Optional Fallback)

```bash
docker run -it --rm   --network host   -v /path/to/app.db:/app/app.db   -p 8000:8000 resume-api
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
  ],
  "salaryTrend": {
    "Data Scientist": {
      "progression": {...},
      "location": {...}
    }
  }
}
```

---

## 🧠 Matching Logic

1. Extracts text from PDF using `PyMuPDF`
2. Extracts skills using **Gemini 1.5 Flash** (Python list format)
3. Computes skill embeddings using **MiniLM (SBERT)**
4. Filters and ranks jobs using **cosine similarity**
5. Sends top jobs to **Gemini 2.0 Flash** for match re-ranking and reasons
6. Fallback to Mistral (via Ollama) if Gemini fails
7. Optionally includes salary trend analytics

---

## ⚠️ Notes

- The SQLite database (`app.db`) is not included in the Docker image, but you can get it from [here](https://drive.google.com/drive/folders/1Xgr6kozgCiz7j0UL4Hshb0uUTh2S7f28?)
- Make sure to load or generate job embeddings before matching
- Ollama is **optional** but required for fallback and additional LLM services
- All LLM usage is handled locally or with Gemini API

---

## 📚 License

MIT License
