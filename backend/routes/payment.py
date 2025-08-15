from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/save_card", response_model=schemas.PaymentResponse)
def save_card(card: schemas.PaymentCreate, db: Session = Depends(get_db)):
    # Check if the card already exists for the same number
    existing_card = db.query(models.Payment).filter(models.Payment.cardnumber == card.cardnumber).first()
    if existing_card:
        raise HTTPException(status_code=400, detail="Card already exists")

    # Create new card entry
    new_card = models.Payment(
        email=card.email,
        cardnumber=card.cardnumber,
        cvv=card.cvv,
        exprire=card.exprire  # match schema and model
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return new_card
