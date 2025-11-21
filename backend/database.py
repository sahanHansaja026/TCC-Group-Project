from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL URL with SSL
DATABASE_URL = "postgresql://neondb_owner:npg_Nh94KGFseVTC@ep-sparkling-lake-ad9zpxqy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Create engine with pool_pre_ping to prevent closed connection errors
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # <--- important for "SSL connection has been closed unexpectedly"
    connect_args={},         # optional, can pass SSL args if needed
)

# SessionLocal factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False   # avoids lazy-loading issues after commit
)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
