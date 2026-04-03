import pytest
from fastapi import HTTPException
from types import SimpleNamespace
from app.routes.auth_routes import (register_user, 
                                    login_user, 
                                    get_me, 
                                    update_me)
from app.models import UserRole


# ---------------- MOCK DB ----------------

class DummyQuery:
    def __init__(self, result=None):
        self.result = result

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.result


class DummyDB:
    def __init__(self):
        self.data = []

    def query(self, model):
        return DummyQuery()

    def add(self, obj):
        self.data.append(obj)

    def commit(self):
        pass

    def refresh(self, obj):
        pass


# ---------------- REGISTER ----------------

class RegisterData:
    def __init__(self):
        self.name = "Test"
        self.email = "test@mail.com"
        self.phone = "1234567890"
        self.city = "Delhi"
        self.password = "pass123"


def test_register_success():
    db = DummyDB()
    db.query = lambda model: DummyQuery(result=None)

    response = register_user(RegisterData(), db)

    assert response["message"] == "User registered successfully"
    assert response["user"]["email"] == "test@mail.com"


def test_register_duplicate_email():
    db = DummyDB()
    db.query = lambda model: DummyQuery(result=object())

    with pytest.raises(HTTPException) as exc:
        register_user(RegisterData(), db)

    assert exc.value.status_code == 400


# ---------------- LOGIN ----------------

class LoginData:
    def __init__(self):
        self.email = "test@mail.com"
        self.password = "pass123"


def test_login_success(monkeypatch):
    db = DummyDB()

    user = SimpleNamespace(
        email="test@mail.com",
        password_hash="hashed",
        is_active=True,
        role=UserRole.BUSINESS_CLIENT
    )

    db.query = lambda model: DummyQuery(result=user)

    monkeypatch.setattr("app.routes.auth_routes.verify_password", lambda p, h: True)
    monkeypatch.setattr("app.routes.auth_routes.create_access_token", lambda data: "fake-token")

    response = login_user(LoginData(), db)

    assert response["access_token"] == "fake-token"
    assert response["token_type"] == "bearer"
    assert response["role"] == user.role.value


def test_login_invalid_credentials(monkeypatch):
    db = DummyDB()

    user = SimpleNamespace(
        email="test@mail.com",
        password_hash="hashed",
        is_active=True,
        role=UserRole.BUSINESS_CLIENT
    )

    db.query = lambda model: DummyQuery(result=user)

    monkeypatch.setattr("app.routes.auth_routes.verify_password", lambda p, h: False)

    with pytest.raises(HTTPException) as exc:
        login_user(LoginData(), db)

    assert exc.value.status_code == 401


def test_login_inactive_user(monkeypatch):
    db = DummyDB()

    user = SimpleNamespace(
        email="test@mail.com",
        password_hash="hashed",
        is_active=False,
        role=UserRole.BUSINESS_CLIENT
    )

    db.query = lambda model: DummyQuery(result=user)

    monkeypatch.setattr("app.routes.auth_routes.verify_password", lambda p, h: True)

    with pytest.raises(HTTPException) as exc:
        login_user(LoginData(), db)

    assert exc.value.status_code == 403


# ---------------- GET ME ----------------

def test_get_me():
    user = SimpleNamespace(
        id=1,
        name="Test",
        email="test@mail.com",
        phone="123",
        role=UserRole.BUSINESS_CLIENT
    )

    response = get_me(user)

    assert response["email"] == "test@mail.com"


# ---------------- UPDATE ME ----------------

class UpdateData:
    def __init__(self, name=None, email=None, phone=None, password=None):
        self.name = name
        self.email = email
        self.phone = phone
        self.password = password


def test_update_me_success():
    db = DummyDB()

    user = SimpleNamespace(
        id=1,
        name="Old",
        email="old@mail.com",
        phone="111",
        role=UserRole.BUSINESS_CLIENT
    )

    db.query = lambda model: DummyQuery(result=None)

    data = UpdateData(name="New", email="new@mail.com", phone="999")

    response = update_me(data, db, user)

    assert response["user"]["name"] == "New"
    assert response["user"]["email"] == "new@mail.com"


def test_update_me_duplicate_email():
    db = DummyDB()

    user = SimpleNamespace(
        id=1,
        name="Test",
        email="old@mail.com",
        phone="111",
        role=UserRole.BUSINESS_CLIENT
    )

    existing_user = SimpleNamespace(id=2)

    db.query = lambda model: DummyQuery(result=existing_user)

    data = UpdateData(email="duplicate@mail.com")

    with pytest.raises(HTTPException) as exc:
        update_me(data, db, user)

    assert exc.value.status_code == 400


def test_update_me_password(monkeypatch):
    db = DummyDB()

    user = SimpleNamespace(
        id=1,
        name="Test",
        email="test@mail.com",
        phone="111",
        role=UserRole.BUSINESS_CLIENT,
        password_hash="old_hash"
    )

    db.query = lambda model: DummyQuery(result=None)

    monkeypatch.setattr("app.routes.auth_routes.hash_password", lambda p: "new_hash")

    data = UpdateData(password="newpass")

    update_me(data, db, user)

    assert user.password_hash == "new_hash"