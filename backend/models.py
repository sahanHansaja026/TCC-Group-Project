import email
from enum import unique
from sqlalchemy import Column,Numeric,Integer,String,LargeBinary,Time,Date # type: ignore
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
    
    id = Column(Integer,primary_key=True, index=True)  
    email=Column(String)
    cardnumber = Column(String,unique=True,index=True)
    cvv=Column(String)
    exprire=Column(String)
    
class Vechical(Base):
    __tablename__ ="vechical"
    
    id = Column(Integer,primary_key=True, index=True)  
    email=Column(String)
    licenseplate = Column(String,unique=True,index=True)
    make=Column(String)
    model=Column(String)
    color=Column(String)
    
class Stotbokk(Base):
    __tablename__="parking_slot"
    slotid = Column(Integer,primary_key=True, index=True)  
    slotnumber = Column(String)
    status = Column(String)
    parkinglotid = Column(Integer)
    
class Bokking(Base):
    __tablename__ = "booking"
    BookingID = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    StartTime = Column(Time, nullable=False)
    EndTime = Column(Time, nullable=False)
    status = Column(String, nullable=False)
    DriverID = Column(Integer, nullable=False)
    VechicalID = Column(Integer, nullable=False)
    slotid = Column(Integer, nullable=False)
    
class CardPayment(Base):
    __tablename__ = "payments"
    
    TransactionID = Column(Integer, primary_key=True, index=True)
    Amount = Column(Numeric(10, 2), nullable=False)   # Decimal/Numeric
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)
    PaymentMethod = Column(String, nullable=False)
    SessionID = Column(Integer, nullable=False)
    SubscriptionID = Column(Integer, nullable=False)