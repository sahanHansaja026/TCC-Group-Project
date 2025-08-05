from pydantic import BaseModel # type: ignore

class UserCreate(BaseModel):
    username:str
    email:str
    password:str
    
class UserLogin(BaseModel):
    email:str
    password:str
    