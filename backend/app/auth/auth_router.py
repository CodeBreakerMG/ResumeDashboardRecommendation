# This file contains the authentication routes for user registration and login.
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

# This is the router for authentication
router = APIRouter(prefix="/auth", tags=["Auth"])


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User registration and login routes
@router.post("/register")
def register(user: user_schema.UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(user_model.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.") # 400 Bad Request
    # Hash the password and create a new user
    hashed = get_password_hash(user.password)
    new_user = user_model.User(email=user.email, hashed_password=hashed)
    # Add the new user to the database
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully."}

# User login route
@router.post("/login")
def login(user: user_schema.UserLogin, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(user_model.User).filter_by(email=user.email).first()
    # If user does not exist or password is incorrect, raise an error
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    # Create access token
    token = create_access_token({"sub": user.email})
    # Return the token
    return {"access_token": token, "token_type": "bearer"}