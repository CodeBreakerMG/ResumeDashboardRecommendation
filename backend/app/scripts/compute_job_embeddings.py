# This script computes the embeddings for job postings that do not have them yet.
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting
from sentence_transformers import SentenceTransformer

# Load the pre-trained model
model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# Function to compute embeddings for job postings
def compute_embeddings():
    # Create a new database session
    db: Session = SessionLocal()
    jobs = db.query(JobPosting).filter(JobPosting.embedding == None).all() # Get all job postings without embeddings

    # Check if there are any jobs to process
    for job in jobs:
        # Skip jobs without skills
        if not job.skills:
            continue
        # Compute the embedding for the job's skills
        text = ", ".join(job.skills)
        job.embedding = model.encode(text).tolist()
        db.add(job)

    # Commit the changes to the database
    db.commit()
    db.close()
    print(f"✅ Computed embeddings for {len(jobs)} jobs.")

# Run the function if this script is executed directly
if __name__ == "__main__":
    compute_embeddings()
