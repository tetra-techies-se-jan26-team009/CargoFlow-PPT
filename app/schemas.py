from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ShipmentCreate(BaseModel):
    sender_name: str
    receiver_name: str
    receiver_phone: str
    address: str
    cod_amount: float