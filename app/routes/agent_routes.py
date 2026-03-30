from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..auth import require_role
from ..schemas import ShipmentCreate
from .admin_routes import generate_tracking_number

router = APIRouter(prefix="/api/v1/agent", tags=["Agent Routes"])

@router.get("/dashboard", status_code=200)
def agent_dashboard(db: Session = Depends(get_db),
                    current_user: User = Depends(require_role(UserRole.DELIVERY_AGENT))):

    total_assigned = db.query(Shipment).filter(
        Shipment.assigned_agent_id == current_user.id
    ).count()

    completed = db.query(Shipment).filter(
        Shipment.assigned_agent_id == current_user.id,
        Shipment.status == ShipmentStatus.DELIVERED
    ).count()

    pending = db.query(Shipment).filter(
        Shipment.assigned_agent_id == current_user.id,
        Shipment.status.in_([
            ShipmentStatus.ASSIGNED,
            ShipmentStatus.OUT_FOR_DELIVERY,
            ShipmentStatus.CREATED
        ])
    ).count()

    earnings = db.query(func.sum(Shipment.price)).filter(
        Shipment.assigned_agent_id == current_user.id,
        Shipment.status == ShipmentStatus.DELIVERED
    ).scalar() or 0

    active_shipment = db.query(Shipment).filter(
        Shipment.assigned_agent_id == current_user.id,
        Shipment.status.in_([
            ShipmentStatus.ASSIGNED,
            ShipmentStatus.OUT_FOR_DELIVERY
        ])
    ).order_by(Shipment.updated_at.desc()).first()

    active_delivery = None

    if active_shipment:
        progress_map = {
            ShipmentStatus.CREATED: 10,
            ShipmentStatus.ASSIGNED: 40,
            ShipmentStatus.OUT_FOR_DELIVERY: 80,
            ShipmentStatus.DELIVERED: 100
        }

        active_delivery = {
            "tracking_id": active_shipment.tracking_number,
            "status": active_shipment.status.value,
            "progress": progress_map.get(active_shipment.status, 0),

            "customer": {
                "name": active_shipment.receiver_name,
                "phone": active_shipment.receiver_phone
            },

            "delivery_address": {
                "line": active_shipment.delivery_address.line1,
                "city": active_shipment.delivery_address.city,
                "pincode": active_shipment.delivery_address.pincode
            },

            "package": {
                "weight": active_shipment.weight,
                "price": active_shipment.price
            },

            "eta": active_shipment.eta_end_time
        }

    # ------------------ OPTIONAL METRICS ------------------

    # (You can later replace with real GPS tracking)
    total_distance = 0  # placeholder
    rating = 4.8  # static for now

    # ------------------ RESPONSE ------------------

    return {
        "summary": {
            "completed": completed,
            "pending": pending,
            "total": total_assigned,
            "earnings": earnings,
            "distance": total_distance,
            "rating": rating
        },
        "active_delivery": active_delivery
    }