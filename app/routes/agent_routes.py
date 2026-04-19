from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..auth import require_role
from ..schemas import LocationUpdate, AgentUpdateShipmentStatus, DutyStatusUpdate

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

@router.patch("/shipments/{id}/status")
def update_shipment_status(id: int,
                  data: AgentUpdateShipmentStatus,
                  db: Session = Depends(get_db),
                  current_user: User = Depends(require_role(UserRole.DELIVERY_AGENT))):
    
    shipment = db.query(Shipment).filter(Shipment.id == id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    if shipment.assigned_agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    
    VALID_TRANSITIONS = {
        ShipmentStatus.ASSIGNED: [ShipmentStatus.OUT_FOR_DELIVERY],
        ShipmentStatus.OUT_FOR_DELIVERY: [
            ShipmentStatus.DELIVERED,
            ShipmentStatus.FAILED
        ],
    }
    if shipment.status not in VALID_TRANSITIONS or data.status not in VALID_TRANSITIONS[shipment.status]:
        raise HTTPException(status_code=400, detail="Invalid status transition")
    
    shipment.status = data.status

    log = ShipmentStatusLog(
        shipment_id=shipment.id,
        status=data.status,
        updated_by=current_user.id,
        remarks=data.remarks)
    db.add(log)

    if current_user.current_lat and current_user.current_lng:
        tracking = TrackingUpdate(
            shipment_id=shipment.id,
            agent_id=current_user.id,
            latitude=current_user.current_lat,
            longitude=current_user.current_lng,
            status=data.status)
        db.add(tracking)

    db.commit()
    db.refresh(shipment)

    return {"message": "Shipment Status updated successfully"}

@router.post("/update/live-location")
def update_location(data: LocationUpdate, 
                    db: Session = Depends(get_db), 
                    current_user: User = Depends(require_role(UserRole.DELIVERY_AGENT))):

    current_user.current_lat = data.lat
    current_user.current_lng = data.lng
    current_user.last_location_update = datetime.utcnow()

    if data.shipment_id:
        shipment = db.query(Shipment).filter(Shipment.id == data.shipment_id).first()

        if not shipment:
            raise HTTPException(status_code=404, detail="Shipment not found")

        if shipment.assigned_agent_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not assigned to this shipment")

        tracking = TrackingUpdate(
            shipment_id=data.shipment_id,
            agent_id=current_user.id,
            latitude=data.lat,
            longitude=data.lng,
            status=ShipmentStatus.OUT_FOR_DELIVERY)
        db.add(tracking)
    db.commit()

    return {"message": "Location updated"}

@router.patch("/update/duty-status", status_code=200)
def update_duty_status(data: DutyStatusUpdate,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(require_role(UserRole.DELIVERY_AGENT))):

    current_user.duty_status = data.status

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Duty status updated successfully",
        "agent": current_user.name,
        "status": current_user.duty_status.value
    }