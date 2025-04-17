from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

def compute_embeddings():
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.embedding == None).all()

    for job in jobs:
        if not job.skills:
            continue
        text = ", ".join(job.skills)
        job.embedding = model.encode(text).tolist()
        db.add(job)

    db.commit()
    db.close()
    print(f"✅ Computed embeddings for {len(jobs)} jobs.")

if __name__ == "__main__":
    compute_embeddings()
