from pydantic import BaseModel, EmailStr, constr # type: ignore
from typing import Optional
from datetime import date, time


class UserCreate(BaseModel):
    username:str
    email:str
    password:str
    
class UserLogin(BaseModel):
    email:str
    password:str

class ProfileBase(BaseModel):
    name: str
    email: str
    contact: Optional[str] = None
    Profileimage: Optional[bytes] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    contact: Optional[str] = None
    profileimage: Optional[str] = None  # base64 string

    class Config:
        orm_mode = True

class PaymentBase(BaseModel):
    email: str
    cardnumber: str 
    cvv: str
    exprire: str

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int

    class Config:
        orm_mode = True

class VechicalBase(BaseModel):
    email: str
    licenseplate: str 
    make: str
    model: str
    color: str
    
class VechicalResponse(VechicalBase):
    id: int

    class Config:
        orm_mode = True

class VechicalCreate(VechicalBase):
    pass

class SlotBase(BaseModel):
    slotnumber: str
    status: str 
    parkinglotid: int

class SlotResponse(SlotBase):
    slotid: int  # must match your model column name

    class Config:
        orm_mode = True

class SlotCreate(SlotBase):
    pass

class BookingBase(BaseModel):
    date: date
    StartTime: time
    EndTime: time
    status: str
    DriverID: int
    VechicalID: int
    slotid: int

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    BookingID: int

    class Config:
        orm_mode = True