from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..schemas import DeliveryAgentCreate, ShipmentCreate
from ..auth import require_role, hash_password
from datetime import date
import random

router = APIRouter(prefix="/api/admin", tags=["Admin Routes"])

@router.post("/add_delivery_agent", status_code=201)
def add_delivery_agent(data: DeliveryAgentCreate,
                       db: Session = Depends(get_db),
                       current_user = Depends(require_role(UserRole.ADMIN))):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=data.name,
                email=data.email,
                phone=data.phone,
                password_hash=hash_password(data.password),
                role=UserRole.DELIVERY_AGENT)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Delivery agent added successfully"}

@router.get("/delivery_agents", status_code=200)
def get_delivery_agent(db: Session = Depends(get_db), 
                       current_user = Depends(require_role(UserRole.ADMIN))):
    
    agents = db.query(User).filter(User.role==UserRole.DELIVERY_AGENT).all()
    return [
        {
            "id": agent.id,
            "name": agent.name,
            "email": agent.email,
            "phone": agent.phone,
            "role": agent.role.value,
            "is_active": agent.is_active,
            "registered_on": agent.created_at
        }
        for agent in agents
    ]

@router.patch("/delivery_agent/{agent_id}/status", status_code=200)
def block_unblock_delivery_agent(agent_id: int,
                                 db: Session = Depends(get_db),
                                 current_user = Depends(require_role(UserRole.ADMIN))):
    
    agent = db.query(User).filter(User.id == agent_id, User.role == UserRole.DELIVERY_AGENT).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Delivery agent not found")
    else:
        agent.is_active = not agent.is_active
        db.commit()
        db.refresh(agent)

    return {
        "agent_id": agent.id,
        "name": agent.name,
        "is_active": agent.is_active,
        "message": "Agent unblocked" if agent.is_active else "Agent blocked"
        }

@router.get("/delivery_agent/{agent_id}", status_code=200)
def get_agent(agent_id: int, 
              db: Session = Depends(get_db), 
              current_user: User = Depends(require_role(UserRole.ADMIN))):
    
    agent = db.query(User).filter(User.id == agent_id,
                                  User.role == UserRole.DELIVERY_AGENT).first()

    if not agent:
        raise HTTPException(status_code=404, detail="Delivery agent not found")

    return {
        "id": agent.id,
        "name": agent.name,
        "email": agent.email,
        "phone": agent.phone,
        "role": agent.role.value,
        "is_active": agent.is_active,
        "registered_on": agent.created_at
    }

@router.get("/businesses", status_code=200)
def get_businesses(db: Session = Depends(get_db),
                   current_user: User = Depends(require_role(UserRole.ADMIN))):
    
    businesses = db.query(Business).all()

    return [
        {
            "id": business.id,
            "name": business.name,
            "type": business.type,
            "registered_on": business.created_at
        }
        for business in businesses
    ]

@router.get("/admin_dashboard", status_code=200)
def admin_dashboard(db: Session = Depends(get_db), 
                    current_user: User = Depends(require_role(UserRole.ADMIN))):

    active_shipments = db.query(Shipment).filter(Shipment.status != ShipmentStatus.DELIVERED).count()

    now = datetime.utcnow()

    delivered_this_month = db.query(Shipment).filter(Shipment.status == ShipmentStatus.DELIVERED, 
                                                     func.extract('month', Shipment.updated_at) == now.month, 
                                                     func.extract('year', Shipment.updated_at) == now.year).count()

    active_agents = db.query(User).filter(User.role == UserRole.DELIVERY_AGENT, 
                                          User.is_active == True).count()

    registered_clients = db.query(User).filter(User.role == UserRole.BUSINESS_CLIENT).count()


    shipments = db.query(Shipment).order_by(Shipment.created_at.desc()).limit(5).all()
    recent_shipments = [
        {
            "tracking_number": s.tracking_number,
            "pickup_city": s.pickup_address.city,
            "delivery_city": s.delivery_address.city,
            "status": s.status.value
        }
        for s in shipments
    ]

    today = date.today()

    today_shipments_query = db.query(Shipment).filter(func.date(Shipment.created_at) == today).all()

    today_shipments = [
        {
            "tracking_id": s.tracking_number,
            "client": s.sender.name if s.sender else None,
            "agent": s.assigned_agent.name if s.assigned_agent else "Unassigned",
            "origin": s.pickup_address.city,
            "destination": s.delivery_address.city,
            "status": s.status.value
        }
        for s in today_shipments_query
    ]

    return {
        "active_shipments": active_shipments,
        "delivered_this_month": delivered_this_month,
        "active_agents": active_agents,
        "registered_clients": registered_clients,
        "recent_shipments": recent_shipments,
        "today_shipments": today_shipments
    }

def generate_tracking_number(db: Session):
    while True:
        date_part = datetime.utcnow().strftime("%Y%m%d")
        random_part = random.randint(1000, 9999)
        tracking_number = f"CF-{date_part}-{random_part}"

        existing = db.query(Shipment).filter(
            Shipment.tracking_number == tracking_number
        ).first()

        if not existing:
            return tracking_number

@router.post("/shipments", status_code=201)
def create_shipment(data: ShipmentCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.BUSINESS_CLIENT))):

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