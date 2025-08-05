import email
from enum import unique
from sqlalchemy import Column,Integer,String,LargeBinary # type: ignore
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer,primary_key=True, index=True)
    email = Column(String,unique=True,index=True)
    username = Column(String)
    hashed_password = Column(String)
    

