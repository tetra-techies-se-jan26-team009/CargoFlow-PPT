import pytest
from types import SimpleNamespace
from fastapi import HTTPException

from app.routes.agent_routes import agent_dashboard, update_location
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

    def first(self):
        return self.result


class DummyDB:
    def __init__(self, responses=None):
        self.responses = responses or []
        self.call_index = 0
        self.added = []

    def query(self, model):
        if self.call_index < len(self.responses):
            res = self.responses[self.call_index]
            self.call_index += 1
            return res
        return DummyQuery()

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        pass


# ---------------- DASHBOARD TESTS ----------------

def test_agent_dashboard_with_active_delivery():
    shipment = SimpleNamespace(
        tracking_number="CF-123",
        status=ShipmentStatus.OUT_FOR_DELIVERY,
        receiver_name="John",
        receiver_phone="9999999999",
        delivery_address=SimpleNamespace(
            line1="Street 1",
            city="Delhi",
            pincode="110001"
        ),
        weight=2.5,
        price=500,
        eta_end_time="2026-01-01"
    )

    responses = [
        DummyQuery(count_val=10),
        DummyQuery(count_val=5),
        DummyQuery(count_val=5),
        DummyQuery(scalar_val=2500),
        DummyQuery(result=shipment)
    ]

    db = DummyDB(responses)

    current_user = SimpleNamespace(id=1, role=UserRole.DELIVERY_AGENT)

    result = agent_dashboard(db, current_user)

    assert result["summary"]["total"] == 10
    assert result["summary"]["completed"] == 5
    assert result["summary"]["pending"] == 5
    assert result["summary"]["earnings"] == 2500

    assert result["active_delivery"]["tracking_id"] == "CF-123"
    assert result["active_delivery"]["progress"] == 80


def test_agent_dashboard_no_active_delivery():
    responses = [
        DummyQuery(count_val=8),
        DummyQuery(count_val=3),
        DummyQuery(count_val=5),
        DummyQuery(scalar_val=1500),
        DummyQuery(result=None)
    ]

    db = DummyDB(responses)

    current_user = SimpleNamespace(id=1, role=UserRole.DELIVERY_AGENT)

    result = agent_dashboard(db, current_user)

    assert result["summary"]["total"] == 8
    assert result["active_delivery"] is None


def test_agent_dashboard_zero_earnings():
    responses = [
        DummyQuery(count_val=5),
        DummyQuery(count_val=2),
        DummyQuery(count_val=3),
        DummyQuery(scalar_val=None),  # fallback to 0
        DummyQuery(result=None)
    ]

    db = DummyDB(responses)

    current_user = SimpleNamespace(id=1, role=UserRole.DELIVERY_AGENT)

    result = agent_dashboard(db, current_user)

    assert result["summary"]["earnings"] == 0


# ---------------- UPDATE LOCATION TESTS ----------------

def test_update_location_success_no_shipment():
    db = DummyDB()

    user = SimpleNamespace(
        id=1,
        current_lat=None,
        current_lng=None,
        last_location_update=None
    )

    data = SimpleNamespace(lat=12.9, lng=77.5, shipment_id=None)

    result = update_location(data, db, user)

    assert user.current_lat == 12.9
    assert user.current_lng == 77.5
    assert result["message"] == "Location updated"


def test_update_location_with_shipment_success():
    shipment = SimpleNamespace(id=1, assigned_agent_id=1)

    db = DummyDB([DummyQuery(result=shipment)])

    user = SimpleNamespace(id=1)

    data = SimpleNamespace(lat=10, lng=20, shipment_id=1)

    result = update_location(data, db, user)

    assert result["message"] == "Location updated"
    assert len(db.added) == 1  # tracking added


def test_update_location_shipment_not_found():
    db = DummyDB([DummyQuery(result=None)])

    user = SimpleNamespace(id=1)

    data = SimpleNamespace(lat=10, lng=20, shipment_id=1)

    with pytest.raises(HTTPException) as exc:
        update_location(data, db, user)

    assert exc.value.status_code == 404


def test_update_location_wrong_agent():
    shipment = SimpleNamespace(id=1, assigned_agent_id=2)

    db = DummyDB([DummyQuery(result=shipment)])

    user = SimpleNamespace(id=1)

    data = SimpleNamespace(lat=10, lng=20, shipment_id=1)

    with pytest.raises(HTTPException) as exc:
        update_location(data, db, user)

    assert exc.value.status_code == 403