from fastapi import FastAPI
from app.auth import auth_router
from app.api import resume
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router.router)
app.include_router(resume.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
