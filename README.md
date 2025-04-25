# 📊 Smart Resume Parser

An end-to-end resume parsing and job recommendation system with an interactive dashboard. Built with **FastAPI**, **React**, **LLMs (Gemini Flash 2.0)**, and **SBERT embeddings**, the system supports AI-based skill extraction, job matching, and data visualization.

Project developed for **CSCE679 – Data Visualization**.

---

## 🗂️ Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Docker Compose](#docker-compose)
  - [Manual Setup](#manual-setup)
- [API Reference](#api-reference)
- [Credits](#credits)
- [License](#license)

---

## 🌐 Overview

This system allows users to upload a resume and receive job matches, salary trends, and profile insights. It features:

- AI-powered skill extraction using Ollama and Gemini
- SBERT embedding-based job similarity
- LLM-generated match explanations
- Interactive charts and maps in the dashboard

---

## ✨ Features

- PDF resume parsing
- AI skill extraction and match justification
- Interactive word clouds, radar charts, salary trends
- Full CRUD job management via FastAPI
- Responsive design using Material UI
- Word cloud from extracted skills
- U.S. salary distribution map via React Leaflet
- SQLite-powered local database (external)

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, SBERT, Gemini Flash 2.0, SQLite, SpaCy
- **Frontend**: React, MUI v5, Recharts, D3.js, React Leaflet, Axios
- **Dockerized**: API (`resume-api`), Dashboard (`resume-frontend`)

---

## 📁 Project Structure

```
ResumeDashboard/
├── backend/                     # FastAPI-based resume matcher
│   ├── app/                     # Routes, services, models
│   └── Dockerfile
├── frontend/
│   └── dataviz-dashboard/       # React-based dashboard
│       ├── src/                 # Pages, components, charts
│       └── Dockerfile
├── docker-compose.yml           # Compose file to run full stack
└── README.md                    # This file
```

---

## ⚙️ Setup Instructions

### 🐳 Docker Compose

Clone the repo and run both backend and frontend using the provided `docker-compose.yml` in this directory:

```bash
git clone https://github.com/CodeBreakerMG/ResumeDashboardRecommendation.git
cd ResumeDashboardRecommendation

# Start all services
docker compose up --build
```

Make sure your **SQLite database** (e.g., `app.db`) exists and mount its path in `docker-compose.yml`. You can get the database from [here](https://drive.google.com/drive/folders/1Xgr6kozgCiz7j0UL4Hshb0uUTh2S7f28?usp=sharing).

Access:

- Backend: `http://localhost:8000/docs`
- Frontend: `http://localhost:3000`

> ⚠️ **Make sure your `.env` file contains a valid `GEMINI_API_KEY`:**

---

### 🧪 Manual Setup

#### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

> API: `http://localhost:8000`

#### Frontend (React)

```bash
cd frontend/dataviz-dashboard
npm install
npm start
```

> Frontend: `http://localhost:3000`

---

## 🔗 API Reference

**POST** `/resume/match`  
Upload a resume to get job matches and insights.

**Request:** `multipart/form-data` with `file` = resume PDF

**Response:**

```json
{
  "resume_skills": [...],
  "matches": [
    {
      "jobId": 123,
      "matchScore": 0.85,
      "matchedSkills": [...],
      "matchReason": "Mentions SQL and Docker, aligns with role."
    }
  ],
  "wordCloud": [
    { "text": "python", "value": 5 }
  ],
  "salaryTrend": { /* ... */ },
  "resumeProfile": { /* education, experience, industries */ }
}
```

---

## 🙌 Credits

- Rishik Gupta
- Manuel Moran
- Cesar Salazar
- Madelein Villegas

This project was developed collaboratively as part of the Spring 2025 CSCE679 course.

---

## 📄 License

MIT License

---
