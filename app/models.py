from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    DELIVERY_AGENT = "DELIVERY_AGENT"
    BUSINESS_CLIENT = "BUSINESS_CLIENT"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(UserRole), default=UserRole.BUSINESS_CLIENT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


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

    client_id = Column(Integer, ForeignKey("users.id"))
    client = relationship("User", foreign_keys=[client_id])

    delivery_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    delivery_agent = relationship("User", foreign_keys=[delivery_agent_id])
