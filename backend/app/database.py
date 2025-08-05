from sqlalchemy import create_engine # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore
from sqlalchemy.orm import sessionmaker # type: ignore

# Database connection URL format:
# postgresql://<username>:<password>@<host>:<port>/<database_name>
DATABASE_URL = "postgresql://postgres:123@localhost:5432/test_fastapi_backend"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False,autocommit=False)
Base=declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()