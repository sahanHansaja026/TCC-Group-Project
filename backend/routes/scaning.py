from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/vehicle/{license_plate}", response_model=schemas.VechicalResponse)
def get_vehicle_by_license(license_plate: str, db: Session = Depends(get_db)):
    # 1️⃣ Find vehicle by license plate
    vehicle = db.query(models.Vechical).filter(models.Vechical.licenseplate == license_plate).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # 2️⃣ Return vehicle details
    return vehicle
