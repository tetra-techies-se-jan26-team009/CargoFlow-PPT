from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Shipment, ShipmentStatus
from ..schemas import ShipmentCreate
import uuid

router = APIRouter(prefix="/shipments", tags=["Shipments"])

@router.post("/")
def create_shipment(data: ShipmentCreate, db: Session = Depends(get_db)):
    shipment = Shipment(
        tracking_id=str(uuid.uuid4())[:8],
        sender_name=data.sender_name,
        receiver_name=data.receiver_name,
        receiver_phone=data.receiver_phone,
        address=data.address,
        cod_amount=data.cod_amount,
        status=ShipmentStatus.CREATED)

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment