from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/create_booking", response_model=schemas.BookingResponse)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    new_booking = models.Bokking(
        date=booking.date,
        StartTime=booking.StartTime,
        EndTime=booking.EndTime,
        status=booking.status,
        DriverID=booking.DriverID,
        VechicalID=booking.VechicalID,
        slotid=booking.slotid
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking
