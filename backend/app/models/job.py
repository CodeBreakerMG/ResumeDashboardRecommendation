from sqlalchemy import Column, String, Integer, Float, Date, JSON
from app.db.database import Base

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    experience = Column(String)
    qualifications = Column(String)
    salary_range = Column(String)
    location = Column(String)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    work_type = Column(String)
    company_size = Column(Integer)
    job_posting_date = Column(Date)
    preference = Column(String)
    contact_person = Column(String)
    contact = Column(String)
    job_title = Column(String)
    role = Column(String)
    job_portal = Column(String)
    job_description = Column(String)
    benefits = Column(JSON)  # <- parsed list
    skills = Column(JSON)    # <- parsed list
    responsibilities = Column(String)
    company = Column(String)
    company_profile = Column(JSON)  # <- parsed dict
    embedding = Column(JSON, nullable=True)