from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..auth import require_role
from ..genai import generate_ai_response
from ..schemas import AIRequest

router = APIRouter(prefix="/api/v1/ai", tags=["AI"])

@router.post("/assistant")
def ai_assistant(data: AIRequest):
    response = generate_ai_response(data.prompt)
    return {"response": response}


# ----------- SMART TRACKING EXPLANATION -----------

@router.get("/track-explain/{tracking_id}")
def explain_tracking(tracking_id: str,
                     db: Session = Depends(get_db),
                     current_user = Depends(require_role(UserRole.BUSINESS_CLIENT))):

    shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Invalid tracking ID")

    prompt = f"""
    Explain this shipment in simple language:
    Status: {shipment.status.value}
    From: {shipment.pickup_address.city}
    To: {shipment.delivery_address.city}
    """

    response = generate_ai_response(prompt)

    return {
        "tracking_id": tracking_id,
        "ai_explanation": response
    }