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

    receiver_name: str
    receiver_phone: str
    receiver_email: EmailStr

    pickup_line1: str
    pickup_city: str
    pickup_state: str
    pickup_pincode: str

    delivery_line1: str
    delivery_city: str
    delivery_state: str
    delivery_pincode: str

    weight: float
    price: float