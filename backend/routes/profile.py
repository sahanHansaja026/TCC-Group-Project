from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
import models
from database import get_db
import shutil
import os
import base64
import schemas

router = APIRouter()

@router.post("/profile/")
async def create_profile(
    name: str = Form(...),
    email: str = Form(...),
    contact: str = Form(...),
    profileimage: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    print(f"Received name: {name}")
    print(f"Received email: {email}")
    print(f"Received contact: {contact}")

    image_data = None
    if profileimage:
        image_data = await profileimage.read()
        print(f"Received image size: {len(image_data)} bytes")
    else:
        print("No image received")

    new_profile = models.Profile(
        name=name,
        email=email,
        contact=contact,
        profileimage=image_data,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return {"message": "Profile created", "profile_id": new_profile.id}


@router.get("/profile/email", response_model=schemas.ProfileResponse)
def get_profile_by_email(email: str, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.email == email).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Convert binary profileimage to base64 string if exists
    profile_image_base64 = None
    if profile.profileimage:
        profile_image_base64 = base64.b64encode(profile.profileimage).decode('utf-8')

    return {
        "id": profile.id,
        "name": profile.name,
        "email": profile.email,
        "contact": profile.contact,
        "profileimage": profile_image_base64,
    }