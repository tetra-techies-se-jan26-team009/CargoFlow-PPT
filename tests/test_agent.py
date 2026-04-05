from app.auth import get_current_user
from app.models import UserRole
from conftest import DummyUser


def override_agent():
    return DummyUser(UserRole.DELIVERY_AGENT)


def test_dashboard(client):
    client.app.dependency_overrides[get_current_user] = override_agent
    assert client.get("/api/v1/agent/dashboard").status_code == 200


def test_update_location(client):
    client.app.dependency_overrides[get_current_user] = override_agent

    res = client.post("/api/v1/agent/update/live-location", json={
        "lat": 10, "lng": 20
    })
    assert res.status_code == 200


def test_invalid_shipment(client):
    client.app.dependency_overrides[get_current_user] = override_agent

    res = client.post("/api/v1/agent/update/live-location", json={
        "lat": 10, "lng": 20, "shipment_id": 999
    })
    assert res.status_code == 404


def test_missing_fields(client):
    client.app.dependency_overrides[get_current_user] = override_agent

    res = client.post("/api/v1/agent/update/live-location", json={})
    assert res.status_code == 422


def test_wrong_role(client):
    # default ADMIN
    res = client.get("/api/v1/agent/dashboard")
    assert res.status_code == 403