from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

@router.post("/save_payment", response_model=schemas.CardPaymentResponse)
def save_payment(payment: schemas.CardPaymentCreate, db: Session = Depends(get_db)):
    print("📥 Incoming payment data:", payment.dict())  # 👈 log the request body
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

@router.get("/payments/subscription/{subscription_id}", response_model=List[schemas.CardPaymentResponse])
def get_payments_by_subscription(subscription_id: int, db: Session = Depends(get_db)):
    payments = db.query(models.CardPayment).filter(
        models.CardPayment.SubscriptionID == subscription_id
    ).all()

    if not payments:
        return []  # return empty list if no payments found

    return payments