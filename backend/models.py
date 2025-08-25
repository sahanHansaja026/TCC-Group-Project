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
    
class Profile(Base):
    __tablename__= "user_profile"
    
    id = Column(Integer,primary_key=True, index=True)
    name = Column(String)
    email=Column(String)
    contact=Column(String)
    profileimage = Column(LargeBinary) 

class Payment(Base):
    __tablename__= "card_details"
    
    id =  id = Column(Integer,primary_key=True, index=True)  
    email=Column(String)
    cardnumber = Column(String,unique=True,index=True)
    cvv=Column(String)
    exprire=Column(String)
    
class Vechical(Base):
    __tablename__ ="vechical"
    
    id =  id = Column(Integer,primary_key=True, index=True)  
    email=Column(String)
    licenseplate = Column(String,unique=True,index=True)
    make=Column(String)
    model=Column(String)
    color=Column(String)
