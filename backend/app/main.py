# This file is the main entry point for the FastAPI application.
from fastapi import FastAPI
from app.auth import auth_router
from app.api import jobs, resume
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Create an instance of FastAPI
app = FastAPI()

# Middleware to handle CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for different parts of the application
app.include_router(auth_router.router)
app.include_router(resume.router)
app.include_router(jobs.router)

# Define a simple root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Define a simple endpoint to say hello for testing
@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
