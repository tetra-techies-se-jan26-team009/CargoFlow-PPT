from pydantic import BaseModel

class ShipmentCreate(BaseModel):
    sender_name: str
    receiver_name: str
    receiver_phone: str
    address: str
    cod_amount: float