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
    
    if profile:
        profile_image_base64 = (
            base64.b64encode(profile.profileimage).decode('utf-8')
            if profile.profileimage else None
        )
        return {
            "id": profile.id,
            "name": profile.name,
            "email": profile.email,
            "contact": profile.contact,
            "profileimage": profile_image_base64,
        }

    # Return default empty profile if not found
    return {
        "id": 0,
        "name": "",
        "email": email,
        "contact": "",
        "profileimage": None,
    }

@router.post("/profile/update", response_model=schemas.ProfileResponse)
async def update_profile(
    email: str = Form(...),
    name: str = Form(...),
    contact: str = Form(...),
    profileimage: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Find existing user profile
    profile = db.query(models.Profile).filter(models.Profile.email == email).first()

    # If no profile exists → create one
    if not profile:
        profile = models.Profile(email=email)

    # Update fields
    profile.name = name
    profile.contact = contact

    # If a new image is uploaded
    if profileimage:
        profile.profileimage = await profileimage.read()

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return {
        "id": profile.id,
        "name": profile.name,
        "email": profile.email,
        "contact": profile.contact,
        "profileimage": (
            base64.b64encode(profile.profileimage).decode("utf-8")
            if profile.profileimage else None
        ),
    }

@router.delete("/profile/{profile_id}")
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()

    if not profile:
        return {"message": "Profile already removed or not found."}

    # delete profile record
    db.delete(profile)
    db.commit()

    return {"message": "Profile deleted successfully."}
