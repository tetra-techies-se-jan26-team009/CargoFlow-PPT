from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..auth import require_role
from ..schemas import ShipmentCreate
from .admin_routes import generate_tracking_number

router = APIRouter(prefix="/api/v1/client", tags=["Client Routes"])

@router.get("/dashboard", status_code=200)
def client_dashboard(db: Session = Depends(get_db),
                     current_user: User = Depends(require_role(UserRole.BUSINESS_CLIENT))):

    # ------------------ COUNTS ------------------

    active_shipments = db.query(Shipment).filter(
        Shipment.sender_id == current_user.id,
        Shipment.status.in_([
            ShipmentStatus.CREATED,
            ShipmentStatus.ASSIGNED,
            ShipmentStatus.OUT_FOR_DELIVERY
        ])
    ).count()

    delivered = db.query(Shipment).filter(
        Shipment.sender_id == current_user.id,
        Shipment.status == ShipmentStatus.DELIVERED
    ).count()

    pending_pickup = db.query(Shipment).filter(
        Shipment.sender_id == current_user.id,
        Shipment.status == ShipmentStatus.CREATED
    ).count()

    open_invoices = db.query(func.sum(Shipment.price)).filter(
        Shipment.sender_id == current_user.id,
        Shipment.status != ShipmentStatus.DELIVERED
    ).scalar() or 0

    # ------------------ ACTIVE SHIPMENT ------------------

    active_shipment = db.query(Shipment)\
        .filter(
            Shipment.sender_id == current_user.id,
            Shipment.status != ShipmentStatus.DELIVERED
        )\
        .order_by(Shipment.created_at.desc())\
        .first()

    active_shipment_data = None

    if active_shipment:
        progress_map = {
            ShipmentStatus.CREATED: 10,
            ShipmentStatus.ASSIGNED: 40,
            ShipmentStatus.OUT_FOR_DELIVERY: 80,
            ShipmentStatus.DELIVERED: 100
        }

        progress = progress_map.get(active_shipment.status, 0)

        active_shipment_data = {
            "tracking_id": active_shipment.tracking_number,
            "origin": active_shipment.pickup_address.city,
            "destination": active_shipment.delivery_address.city,
            "status": active_shipment.status.value,
            "progress": progress,
            "eta": active_shipment.eta_end_time,
            "agent": active_shipment.assigned_agent.name if active_shipment.assigned_agent else None
        }

    # ------------------ DELIVERY TIMELINE ------------------

    timeline = []

    if active_shipment:
        logs = db.query(ShipmentStatusLog)\
            .filter(ShipmentStatusLog.shipment_id == active_shipment.id)\
            .order_by(ShipmentStatusLog.timestamp.asc())\
            .all()

        timeline = [
            {
                "status": log.status.value,
                "timestamp": log.timestamp,
                "remarks": log.remarks
            }
            for log in logs
        ]

    # ------------------ RECENT SHIPMENTS ------------------

    recent_shipments_query = db.query(Shipment)\
        .filter(Shipment.sender_id == current_user.id)\
        .order_by(Shipment.created_at.desc())\
        .limit(5)\
        .all()

    recent_shipments = []

    for s in recent_shipments_query:

        progress_map = {
            ShipmentStatus.CREATED: 10,
            ShipmentStatus.ASSIGNED: 40,
            ShipmentStatus.OUT_FOR_DELIVERY: 80,
            ShipmentStatus.DELIVERED: 100
        }

        recent_shipments.append({
            "tracking_id": s.tracking_number,
            "route": f"{s.pickup_address.city} → {s.delivery_address.city}",
            "agent": s.assigned_agent.name if s.assigned_agent else "Unassigned",
            "progress": progress_map.get(s.status, 0),
            "status": s.status.value,
            "eta": s.eta_end_time
        })


    return {
        "summary": {
            "active_shipments": active_shipments,
            "delivered": delivered,
            "pending_pickup": pending_pickup,
            "open_invoices": open_invoices
        },
        "active_shipment": active_shipment_data,
        "timeline": timeline,
        "recent_shipments": recent_shipments
    }

@router.post("/shipments", status_code=201)
def create_shipment(data: ShipmentCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(require_role(UserRole.BUSINESS_CLIENT))):

    pickup = Address(line1=data.pickup_line1,
                     city=data.pickup_city,
                     state=data.pickup_state,
                     pincode=data.pickup_pincode)

    delivery = Address(line1=data.delivery_line1,
                       city=data.delivery_city,
                       state=data.delivery_state,
                       pincode=data.delivery_pincode)

    db.add_all([pickup, delivery])
    db.flush()

    shipment = Shipment(tracking_number=generate_tracking_number(db),
                        
                        sender_id=current_user.id,
                        
                        receiver_name=data.receiver_name,
                        receiver_phone=data.receiver_phone,
                        receiver_email=data.receiver_email,
                        
                        pickup_address_id=pickup.id,
                        delivery_address_id=delivery.id,
                        
                        weight=data.weight,
                        price=data.price,
                        
                        status=ShipmentStatus.CREATED)

    db.add(shipment)
    db.flush()

    log = ShipmentStatusLog(shipment_id=shipment.id,
                            status=ShipmentStatus.CREATED,
                            updated_by=current_user.id,
                            remarks="Shipment created",
                            timestamp=datetime.utcnow())

    db.add(log)

    db.commit()
    db.refresh(shipment)

    return {
        "tracking_number": shipment.tracking_number,
        "status": shipment.status.value,
        "sender": current_user.name,
        "receiver": shipment.receiver_name,
        "pickup_city": pickup.city,
        "delivery_city": delivery.city
    }

@router.get("/track/{tracking_id}", status_code=200)
def track_shipment_public(tracking_id: str,
                          db: Session = Depends(get_db)):

    shipment = db.query(Shipment).filter(
        Shipment.tracking_number == tracking_id
    ).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Invalid tracking ID")

    # ------------------ PROGRESS ------------------

    progress_map = {
        ShipmentStatus.CREATED: 10,
        ShipmentStatus.ASSIGNED: 40,
        ShipmentStatus.OUT_FOR_DELIVERY: 80,
        ShipmentStatus.DELIVERED: 100
    }

    progress = progress_map.get(shipment.status, 0)

    # ------------------ TIMELINE ------------------

    logs = db.query(ShipmentStatusLog)\
        .filter(ShipmentStatusLog.shipment_id == shipment.id)\
        .order_by(ShipmentStatusLog.timestamp.asc())\
        .all()

    timeline = [
        {
            "status": log.status.value,
            "timestamp": log.timestamp,
            "remarks": log.remarks
        }
        for log in logs
    ]

    return {
        "tracking_id": shipment.tracking_number,
        "status": shipment.status.value,
        "progress": progress,

        "route": {
            "origin": shipment.pickup_address.city,
            "destination": shipment.delivery_address.city
        },

        "agent": {
            "name": shipment.assigned_agent.name if shipment.assigned_agent else "Not Assigned",
            "phone": shipment.assigned_agent.phone if shipment.assigned_agent else None
        },

        "eta": shipment.eta_end_time,

        "timeline": timeline
    }

@router.get("/shipments", status_code=200)
def client_shipments(db: Session = Depends(get_db),
                     current_user: User = Depends(require_role(UserRole.BUSINESS_CLIENT))):

    shipments = db.query(Shipment)\
        .filter(Shipment.sender_id == current_user.id)\
        .order_by(Shipment.created_at.desc())\
        .all()

    # ------------------ COUNTS ------------------

    total = len(shipments)

    in_transit = sum(
        1 for s in shipments
        if s.status in [ShipmentStatus.ASSIGNED, ShipmentStatus.OUT_FOR_DELIVERY]
    )

    delivered = sum(
        1 for s in shipments
        if s.status == ShipmentStatus.DELIVERED
    )

    pending = sum(
        1 for s in shipments
        if s.status == ShipmentStatus.CREATED
    )

    delayed = sum(
        1 for s in shipments
        if s.status == ShipmentStatus.FAILED
    )

    # ------------------ TABLE DATA ------------------

    progress_map = {
        ShipmentStatus.CREATED: 10,
        ShipmentStatus.ASSIGNED: 40,
        ShipmentStatus.OUT_FOR_DELIVERY: 80,
        ShipmentStatus.DELIVERED: 100,
        ShipmentStatus.FAILED: 0
    }

    shipment_list = []

    for s in shipments:
        shipment_list.append({
            "tracking_id": s.tracking_number,
            "route": f"{s.pickup_address.city} → {s.delivery_address.city}",
            "agent": s.assigned_agent.name if s.assigned_agent else "Unassigned",
            "weight": f"{s.weight} kg",
            "price": s.price,
            "date": s.created_at,
            "progress": progress_map.get(s.status, 0),
            "status": s.status.value
        })


    return {
        "counts": {
            "all": total,
            "in_transit": in_transit,
            "delivered": delivered,
            "pending": pending,
            "delayed": delayed
        },
        "shipments": shipment_list
    }