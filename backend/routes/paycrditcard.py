from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/save_payment", response_model=schemas.PaymentResponse)
def save_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    new_payment = models.CardPayment(
        Amount=payment.Amount,
        date=payment.date,
        status=payment.status,
        PaymentMethod=payment.PaymentMethod,
        SessionID=payment.SessionID,
        SubscriptionID=payment.SubscriptionID
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment
