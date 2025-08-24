from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/save_vehicle", response_model=schemas.VechicalResponse)
def save_vehicle(vehicle: schemas.VechicalCreate, db: Session = Depends(get_db)):
    # Optional: Check if vehicle already exists by license plate
    existing_vehicle = db.query(models.Vechical).filter(models.Vechical.licenseplate == vehicle.licenseplate).first()
    if existing_vehicle:
        raise HTTPException(status_code=400, detail="Vehicle with this license plate already exists")

    # Create new vehicle entry
    new_vehicle = models.Vechical(
        email=vehicle.email,
        licenseplate=vehicle.licenseplate,
        make=vehicle.make,
        model=vehicle.model,
        color=vehicle.color
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle

@router.get("/get_vehicle/{email}", response_model=List[schemas.VechicalResponse])
def get_vehicle(email: str, db: Session = Depends(get_db)):
    # Fetch all vehicles by email
    vehicles = db.query(models.Vechical).filter(models.Vechical.email == email).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="No vehicles found for this user")
    
    return vehicles