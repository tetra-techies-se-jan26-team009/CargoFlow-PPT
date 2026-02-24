from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserRole
from ..schemas import DeliveryAgentCreate
from ..auth import require_role, hash_password

router = APIRouter(prefix="/admin", tags=["Admin routes"])

@router.post("/add-delivery-agent")
def add_delivery_agent(data: DeliveryAgentCreate,
                       db: Session = Depends(get_db),
                       current_user = Depends(require_role(UserRole.ADMIN))):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=data.name,
                email=data.email,
                password_hash=hash_password(data.password),
                role=UserRole.DELIVERY_AGENT)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Delivery agent added successfully"}