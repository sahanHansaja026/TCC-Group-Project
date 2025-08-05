import logging
from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from database import engine
import models

from routes import user

logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s - %(message)s')
origins = ["http://localhost:3000", "http://192.168.1.4:19006"]

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Include the user router
app.include_router(user.router, prefix="/user", tags=["User"])

