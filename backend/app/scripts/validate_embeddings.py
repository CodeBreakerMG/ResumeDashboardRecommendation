# Validate the embeddings in the database
import json
import numpy as np
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.job import JobPosting

# Constants
EXPECTED_DIM = 384  # all-MiniLM-L6-v2

# This script checks if the embeddings in the database are valid.
def validate_embeddings():
    db: Session = SessionLocal() # Create a new session
    jobs = db.query(JobPosting).filter(JobPosting.embedding != None).yield_per(100) # Fetch jobs with embeddings

    valid = 0
    invalid = []

    # Iterate through the jobs and validate the embeddings
    for job in jobs:
        try:
            raw = job.embedding
            # Deserialize if stored as JSON string
            if isinstance(raw, str):
                raw = json.loads(raw)
            vec = np.array(raw, dtype=np.float32) # Convert to numpy array
            # Check if the shape and values are valid
            if vec.shape != (EXPECTED_DIM,):
                raise ValueError(f"Unexpected shape {vec.shape}")
            if not np.isfinite(vec).all():
                raise ValueError("Embedding contains NaN or Inf")
            valid += 1
        # Handle exceptions for invalid embeddings
        except Exception as e:
            print(f"❌ Job {job.id} invalid: {e}")
            invalid.append(job.id)
    db.close()
    print(f"\n✅ Valid embeddings: {valid}")
    print(f"❌ Invalid embeddings: {len(invalid)} -> {invalid[:10]}")

if __name__ == "__main__":
    validate_embeddings()
