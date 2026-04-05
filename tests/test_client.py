from app.auth import get_current_user
from app.models import UserRole
from conftest import DummyUser


def override_client():
    return DummyUser(UserRole.BUSINESS_CLIENT)


def test_dashboard(client):
    client.app.dependency_overrides[get_current_user] = override_client
    assert client.get("/api/v1/client/dashboard").status_code == 200


def test_create_shipment_no_business(client):
    client.app.dependency_overrides[get_current_user] = override_client

    res = client.post("/api/v1/client/shipments", json={
        "receiver_name": "R",
        "receiver_phone": "1",
        "receiver_email": "r@test.com",
        "pickup_line1": "A",
        "pickup_city": "C",
        "pickup_state": "S",
        "pickup_pincode": "1",
        "delivery_line1": "B",
        "delivery_city": "D",
        "delivery_state": "S",
        "delivery_pincode": "2",
        "weight": 1,
        "price": 10,
        "category": "GENERAL",
        "fragile": False,
        "priority": "LOW"
    })

    assert res.status_code == 400


def test_track_invalid(client):
    assert client.get("/api/v1/client/track/INVALID").status_code == 404


def test_get_shipments(client):
    client.app.dependency_overrides[get_current_user] = override_client
    assert client.get("/api/v1/client/shipments").status_code == 200


def test_create_business(client):
    client.app.dependency_overrides[get_current_user] = override_client

    res = client.post("/api/v1/client/business", json={
        "name": "B", "type": "Retail"
    })
    assert res.status_code in [200, 201]


def test_update_business_not_found(client):
    client.app.dependency_overrides[get_current_user] = override_client

    res = client.put("/api/v1/client/business", json={
        "name": "B", "type": "Retail"
    })
    assert res.status_code == 404


def test_missing_fields(client):
    client.app.dependency_overrides[get_current_user] = override_client

    res = client.post("/api/v1/client/business", json={})
    assert res.status_code == 422