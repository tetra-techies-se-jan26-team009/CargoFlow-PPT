from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    DELIVERY_AGENT = "DELIVERY_AGENT"
    BUSINESS_CLIENT = "BUSINESS_CLIENT"

class ShipmentStatus(enum.Enum):
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    RETURN_TO_ORIGIN = "RETURN_TO_ORIGIN"


# -------------------- Business --------------------

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship(
        "User",
        foreign_keys=[owner_id],
        back_populates="owned_business"
    )

    users = relationship(
        "User",
        foreign_keys="User.business_id",
        back_populates="business"
    )


# -------------------- User --------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BUSINESS_CLIENT, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=True)

    business = relationship(
        "Business",
        foreign_keys=[business_id],
        back_populates="users"
    )

    owned_business = relationship(
        "Business",
        foreign_keys="Business.owner_id",
        back_populates="owner",
        uselist=False
    )


# -------------------- Address --------------------

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True)
    line1 = Column(String, nullable=False)
    line2 = Column(String)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)


# -------------------- Shipment --------------------

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True)
    tracking_number = Column(String, unique=True, index=True, nullable=False)

    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    pickup_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    delivery_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)

    weight = Column(Float, nullable=False)
    price = Column(Float, nullable=False)

    status = Column(Enum(ShipmentStatus), default=ShipmentStatus.CREATED, nullable=False)

    assigned_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    eta_start_time = Column(DateTime)
    eta_end_time = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow, nullable=False)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    pickup_address = relationship("Address", foreign_keys=[pickup_address_id])
    delivery_address = relationship("Address", foreign_keys=[delivery_address_id])
    assigned_agent = relationship("User", foreign_keys=[assigned_agent_id])


# -------------------- Shipment Assignment --------------------

class ShipmentAssignment(Base):
    __tablename__ = "shipment_assignments"

    id = Column(Integer, primary_key=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    shipment = relationship("Shipment")
    agent = relationship("User", foreign_keys=[agent_id])


# -------------------- Tracking Updates --------------------

class TrackingUpdate(Base):
    __tablename__ = "tracking_updates"

    id = Column(Integer, primary_key=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    shipment = relationship("Shipment")
    agent = relationship("User")


# -------------------- Shipment Status Logs --------------------

class ShipmentStatusLog(Base):
    __tablename__ = "shipment_status_logs"

    id = Column(Integer, primary_key=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    status = Column(Enum(ShipmentStatus), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    remarks = Column(String)

    shipment = relationship("Shipment")
    updater = relationship("User")