# This file is part of the FastAPI project.
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL for SQLite
DATABASE_URL = "sqlite:///./app.db"

# Create a new SQLite database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()