from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Shipment, ShipmentStatus, UserRole
from ..schemas import ShipmentCreate
import uuid
from ..auth import require_role, get_current_user

router = APIRouter(prefix="/shipments", tags=["Shipments"])

@router.post("/")
def create_shipment(data: ShipmentCreate, 
                    db: Session = Depends(get_db), 
                    current_user = Depends(require_role(UserRole.BUSINESS_CLIENT))):
    shipment = Shipment(
        tracking_id=str(uuid.uuid4())[:8],
        sender_name=data.sender_name,
        receiver_name=data.receiver_name,
        receiver_phone=data.receiver_phone,
        address=data.address,
        cod_amount=data.cod_amount,
        status=ShipmentStatus.CREATED,
        client_id=current_user.id)

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment

@router.get("/")
def get_shipments(db: Session = Depends(get_db), 
                  current_user = Depends(get_current_user)):

    if current_user.role == UserRole.ADMIN:
        return db.query(Shipment).all()

    if current_user.role == UserRole.BUSINESS_CLIENT:
        return db.query(Shipment).filter(Shipment.client_id == current_user.id).all()

    if current_user.role == UserRole.DELIVERY_AGENT:
        return db.query(Shipment).filter(Shipment.delivery_agent_id == current_user.id).all()

    return []