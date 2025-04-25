# This file is part of the FastAPI project.
from sqlalchemy import Column, String
from app.db.database import Base

# Define the User model
class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, index=True)
    hashed_password = Column(String)