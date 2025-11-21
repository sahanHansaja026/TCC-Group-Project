import logging
from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from database import engine
import models

from routes import user,profile,payment,vehicals,slot,booking,paycrditcard,location,scaning

logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s - %(message)s')
origins = ["*"]  # allow all origins

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Include the user router
@app.get("/test")
async def test():
    return {"status": "ok"}


app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(profile.router)
app.include_router(payment.router)
app.include_router(vehicals.router)
app.include_router(slot.router)
app.include_router(booking.router)
app.include_router(paycrditcard.router)
app.include_router(location.router)
app.include_router(scaning.router)

app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(payment.router, prefix="/payment", tags=["Payment"])
app.include_router(vehicals.router, prefix="/vehicals", tags=["Vehicals"])
app.include_router(slot.router, prefix="/slot", tags=["Slot"])
app.include_router(booking.router, prefix="/booking", tags=["Booking"])
app.include_router(paycrditcard.router, prefix="/paycrditcard", tags=["PayCreditCard"])

