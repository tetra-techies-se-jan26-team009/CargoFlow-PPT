import pytest
from fastapi import HTTPException
from types import SimpleNamespace

from app.routes.admin_routes import (generate_tracking_number, 
                                     add_delivery_agent,
                                     block_unblock_delivery_agent,
                                     assign_agent)

from app.models import UserRole, ShipmentStatus


# ---------------- MOCK DB ----------------

class DummyQuery:
    def __init__(self, result=None):
        self.result = result

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.result

    def count(self):
        return 1

    def all(self):
        return self.result or []

    def order_by(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self


class DummyDB:
    def __init__(self):
        self.storage = []
        self.responses = []
        self.call_index = 0

    def query(self, model):
        if self.call_index < len(self.responses):
            res = self.responses[self.call_index]
            self.call_index += 1
            return res
        return DummyQuery()

    def add(self, obj):
        self.storage.append(obj)

    def add_all(self, objs):
        self.storage.extend(objs)

    def commit(self):
        pass

    def refresh(self, obj):
        pass

    def flush(self):
        pass


# ---------------- GENERATE TRACKING ----------------

def test_generate_tracking_number_unique():
    db = DummyDB()
    db.responses = [DummyQuery(result=None)]

    tracking = generate_tracking_number(db)

    assert tracking.startswith("CF-")
    assert "-" in tracking


# ---------------- ADD DELIVERY AGENT ----------------

class DummyData:
    def __init__(self):
        self.name = "Agent"
        self.email = "agent@test.com"
        self.phone = "1234567890"
        self.city = "Delhi"
        self.password = "pass123"


def test_add_delivery_agent_success():
    db = DummyDB()
    db.responses = [DummyQuery(result=None)]

    current_user = SimpleNamespace(role=UserRole.ADMIN)

    response = add_delivery_agent(DummyData(), db, current_user)

    assert response["message"] == "Delivery agent added successfully"
    assert len(db.storage) == 1


def test_add_delivery_agent_duplicate():
    db = DummyDB()
    db.responses = [DummyQuery(result=object())]

    current_user = SimpleNamespace(role=UserRole.ADMIN)

    with pytest.raises(HTTPException) as exc:
        add_delivery_agent(DummyData(), db, current_user)

    assert exc.value.status_code == 400


# ---------------- BLOCK / UNBLOCK ----------------

def test_block_unblock_agent_success():
    db = DummyDB()

    agent = SimpleNamespace(
        id=1,
        name="Agent",
        is_active=True,
        role=UserRole.DELIVERY_AGENT
    )

    db.responses = [DummyQuery(result=agent)]

    current_user = SimpleNamespace(role=UserRole.ADMIN)

    response = block_unblock_delivery_agent(1, db, current_user)

    assert response["agent_id"] == 1
    assert response["is_active"] is False


def test_block_unblock_agent_not_found():
    db = DummyDB()
    db.responses = [DummyQuery(result=None)]

    current_user = SimpleNamespace(role=UserRole.ADMIN)

    with pytest.raises(HTTPException) as exc:
        block_unblock_delivery_agent(1, db, current_user)

    assert exc.value.status_code == 404


# ---------------- ASSIGN AGENT ----------------

def test_assign_agent_success():
    db = DummyDB()

    shipment = SimpleNamespace(id=1, assigned_agent_id=None, status=None)
    agent = SimpleNamespace(id=2, name="Agent")

    db.responses = [
        DummyQuery(result=shipment),  # shipment
        DummyQuery(result=agent)      # agent
    ]

    current_user = SimpleNamespace(id=99, role=UserRole.ADMIN)

    response = assign_agent(1, 2, db, current_user)

    assert response["message"] == "Agent assigned successfully"
    assert shipment.assigned_agent_id == 2
    assert shipment.status == ShipmentStatus.ASSIGNED


def test_assign_agent_shipment_not_found():
    db = DummyDB()
    db.responses = [DummyQuery(result=None)]

    current_user = SimpleNamespace(id=1, role=UserRole.ADMIN)

    with pytest.raises(HTTPException) as exc:
        assign_agent(1, 2, db, current_user)

    assert exc.value.status_code == 404


def test_assign_agent_invalid_agent():
    db = DummyDB()

    shipment = SimpleNamespace(id=1)

    db.responses = [
        DummyQuery(result=shipment),
        DummyQuery(result=None)
    ]

    current_user = SimpleNamespace(id=1, role=UserRole.ADMIN)

    with pytest.raises(HTTPException) as exc:
        assign_agent(1, 2, db, current_user)

    assert exc.value.status_code == 404