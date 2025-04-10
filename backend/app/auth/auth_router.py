from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models import user as user_model
from app.models import schema as user_schema
from app.auth.auth_handler import (
    get_password_hash,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: user_schema.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(user_model.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed = get_password_hash(user.password)
    new_user = user_model.User(email=user.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully."}


@router.post("/login")
def login(user: user_schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter_by(email=user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}