from pydantic import BaseModel # type: ignore
from typing import Optional

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