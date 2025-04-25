# This file contains the Pydantic models for request and response schemas.
from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str