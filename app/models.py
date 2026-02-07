from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from datetime import datetime
import enum
from .database import Base


class ShipmentStatus(enum.Enum):
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    RTO = "RETURN_TO_ORIGIN"


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String, unique=True, index=True)

    sender_name = Column(String)
    receiver_name = Column(String)
    receiver_phone = Column(String)
    address = Column(String)

    cod_amount = Column(Float, default=0)

    status = Column(Enum(ShipmentStatus), default=ShipmentStatus.CREATED)

    created_at = Column(DateTime, default=datetime.utcnow)
