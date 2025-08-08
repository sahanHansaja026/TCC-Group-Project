from fastapi import APIRouter, Depends, HTTPException,status # type: ignore
from sqlalchemy.orm import Session # type: ignore
from datetime import datetime, timedelta
from auth import hash_password, veryfy_password
import models, schemas
from database import get_db


router = APIRouter()

@router.post("/profile/")
def create_profile(profile_data: schemas.ProfileCreate, db: Session = Depends(get_db)):
    new_profile = models.Profile(
        name=profile_data.name,
        email=profile_data.email,
        contact=profile_data.contact,
        Profileimage=profile_data.Profileimage
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return {"message": "Profile created successfully", "profile_id": new_profile.id}


@router.get("/profile/{profile_id}")
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
