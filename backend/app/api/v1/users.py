from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from core.auth import hash_password, veryfy_password
import models, schemas
from database import get_db

router = APIRouter()


@router.post("/register/")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@router.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not veryfy_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # For simplicity, return dummy token (replace with JWT later)
    return {
        "message": "Login successful",
        "token": "dummy_token_123",  # Replace with JWT token
        "username": db_user.username,
        "email": db_user.email,
    }
