from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List
from datetime import datetime

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

# ✅ GET route: Fetch ongoing bookings by DriverID and status = "Occupied"
@router.get("/bookings/{driver_id}/occupied", response_model=List[schemas.BookingResponse])
def get_ongoing_bookings(driver_id: int, db: Session = Depends(get_db)):
    now = datetime.now()
    bookings = db.query(models.Bokking).filter(
        models.Bokking.DriverID == driver_id,
        models.Bokking.status == "Occupied",
        models.Bokking.date >= now.date()  # only today or future bookings
    ).all()

    # filter out bookings that already ended today
    ongoing_bookings = []
    for b in bookings:
        end_datetime = datetime.combine(b.date, b.EndTime)
        if end_datetime >= now:
            ongoing_bookings.append(b)

    if not ongoing_bookings:
        raise HTTPException(status_code=404, detail="No completed bookings found for this driver")


    return ongoing_bookings

# -------------------- Completed Bookings --------------------
@router.get("/bookings/{driver_id}/completed", response_model=List[schemas.BookingResponse])
def get_completed_bookings(driver_id: int, db: Session = Depends(get_db)):
    now = datetime.now()
    bookings = db.query(models.Bokking).filter(
        models.Bokking.DriverID == driver_id,
        models.Bokking.status == "Occupied",
        models.Bokking.date <= now.date()
    ).all()

    completed_bookings = [b for b in bookings if datetime.combine(b.date, b.EndTime) < now]
    
    # Always return a list, even if empty
    return completed_bookings

