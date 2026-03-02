from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserRole
from ..schemas import DeliveryAgentCreate
from ..auth import require_role, hash_password

router = APIRouter(prefix="/api/admin", tags=["Admin routes"])

@router.post("/add-delivery-agent", status_code=201)
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

@router.get("/get-delivery-agent", status_code=200)
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