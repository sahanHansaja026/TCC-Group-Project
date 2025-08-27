from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from sqlalchemy import func
import models, schemas

router = APIRouter()

@router.get("/get_available_slots", response_model=List[schemas.SlotResponse])
def get_available_slots(db: Session = Depends(get_db)):
    slots = db.query(models.Stotbokk).filter(func.lower(models.Stotbokk.status) == "available").all()

    if not slots:
        # return a "fake" object indicating all are booked
        return [{
            "slotid": 0,
            "slotnumber": "N/A",
            "status": "Booked",
            "parkinglotid": 0
        }]
    
    return slots

