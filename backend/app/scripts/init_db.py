# Script to initialize the database and create tables
from app.db.database import Base, engine
from app.models.job import JobPosting  # Make sure this is correctly importing

print("📦 Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created.")
