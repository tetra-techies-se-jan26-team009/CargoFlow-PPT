from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class DeliveryAgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class ShipmentCreate(BaseModel):
    sender_name: str
    receiver_name: str
    receiver_phone: str
    address: str
    cod_amount: float