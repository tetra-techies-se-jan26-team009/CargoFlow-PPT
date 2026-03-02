from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DeliveryAgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class ShipmentCreate(BaseModel):
    sender_name: str
    receiver_name: str
    receiver_phone: str
    address: str
    cod_amount: float