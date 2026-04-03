import pytest
from types import SimpleNamespace
from fastapi import HTTPException

from app.routes.client_routes import (client_dashboard,
                                      track_shipment_public,
                                      client_shipments)

from app.models import ShipmentStatus, UserRole


# ---------------- MOCK DB ----------------

class DummyQuery:
    def __init__(self, result=None, count_val=0, scalar_val=None):
        self.result = result
        self.count_val = count_val
        self.scalar_val = scalar_val

    def filter(self, *args, **kwargs):
        return self

    def count(self):
        return self.count_val

    def scalar(self):
        return self.scalar_val

    def order_by(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self

    def first(self):
        return self.result

    def all(self):
        return self.result or []


class DummyDB:
    def __init__(self, responses):
        self.responses = responses
        self.call_index = 0

    def query(self, model):
        res = self.responses[self.call_index]
        self.call_index += 1
        return res


# ---------------- CLIENT DASHBOARD ----------------

def test_client_dashboard_with_active_shipment():
    shipment = SimpleNamespace(
        id=1,
        tracking_number="CF-123",
        status=ShipmentStatus.OUT_FOR_DELIVERY,
        pickup_address=SimpleNamespace(city="Delhi"),
        delivery_address=SimpleNamespace(city="Mumbai"),
        eta_end_time="2026-01-01",
        assigned_agent=SimpleNamespace(name="Agent")
    )

    log = SimpleNamespace(
        status=ShipmentStatus.CREATED,
        timestamp="2026-01-01",
        remarks="Created"
    )

    responses = [
        DummyQuery(count_val=3),   # active
        DummyQuery(count_val=2),   # delivered
        DummyQuery(count_val=1),   # pending pickup
        DummyQuery(scalar_val=500),  # invoices
        DummyQuery(result=shipment),
        DummyQuery(result=[log]),
        DummyQuery(result=[shipment])
    ]

    db = DummyDB(responses)
    user = SimpleNamespace(id=1, role=UserRole.BUSINESS_CLIENT)

    result = client_dashboard(db, user)

    assert result["summary"]["active_shipments"] == 3
    assert result["summary"]["delivered"] == 2
    assert result["summary"]["pending_pickup"] == 1
    assert result["summary"]["open_invoices"] == 500

    assert result["active_shipment"]["tracking_id"] == "CF-123"
    assert len(result["timeline"]) == 1
    assert len(result["recent_shipments"]) == 1


def test_client_dashboard_no_active_shipment():
    responses = [
        DummyQuery(count_val=1),
        DummyQuery(count_val=1),
        DummyQuery(count_val=0),
        DummyQuery(scalar_val=None),
        DummyQuery(result=None),
        DummyQuery(result=[]),
        DummyQuery(result=[])
    ]

    db = DummyDB(responses)
    user = SimpleNamespace(id=1, role=UserRole.BUSINESS_CLIENT)

    result = client_dashboard(db, user)

    assert result["active_shipment"] is None
    assert result["summary"]["open_invoices"] == 0


# ---------------- TRACK SHIPMENT ----------------

def test_track_shipment_success():
    shipment = SimpleNamespace(
        id=1,
        tracking_number="CF-123",
        status=ShipmentStatus.DELIVERED,
        pickup_address=SimpleNamespace(city="Delhi"),
        delivery_address=SimpleNamespace(city="Mumbai"),
        assigned_agent=SimpleNamespace(name="Agent", phone="999"),
        eta_end_time="2026-01-01"
    )

    log = SimpleNamespace(
        status=ShipmentStatus.CREATED,
        timestamp="2026-01-01",
        remarks="Created"
    )

    responses = [
        DummyQuery(result=shipment),
        DummyQuery(result=[log])
    ]

    db = DummyDB(responses)

    result = track_shipment_public("CF-123", db)

    assert result["tracking_id"] == "CF-123"
    assert result["progress"] == 100
    assert result["route"]["origin"] == "Delhi"
    assert result["agent"]["name"] == "Agent"
    assert len(result["timeline"]) == 1


def test_track_shipment_not_found():
    db = DummyDB([DummyQuery(result=None)])

    with pytest.raises(HTTPException) as exc:
        track_shipment_public("INVALID", db)

    assert exc.value.status_code == 404


# ---------------- CLIENT SHIPMENTS ----------------

def test_client_shipments_summary():
    shipments = [
        SimpleNamespace(
            tracking_number="CF-1",
            pickup_address=SimpleNamespace(city="Delhi"),
            delivery_address=SimpleNamespace(city="Mumbai"),
            assigned_agent=None,
            weight=2,
            price=100,
            created_at="2026-01-01",
            status=ShipmentStatus.CREATED
        ),
        SimpleNamespace(
            tracking_number="CF-2",
            pickup_address=SimpleNamespace(city="Delhi"),
            delivery_address=SimpleNamespace(city="Chennai"),
            assigned_agent=SimpleNamespace(name="Agent"),
            weight=3,
            price=200,
            created_at="2026-01-01",
            status=ShipmentStatus.DELIVERED
        )
    ]

    db = DummyDB([DummyQuery(result=shipments)])
    user = SimpleNamespace(id=1, role=UserRole.BUSINESS_CLIENT)

    result = client_shipments(db, user)

    assert result["counts"]["all"] == 2
    assert result["counts"]["delivered"] == 1
    assert result["counts"]["pending"] == 1
    assert result["counts"]["in_transit"] == 0
    assert result["counts"]["delayed"] == 0

    assert len(result["shipments"]) == 2