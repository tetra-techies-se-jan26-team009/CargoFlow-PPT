# Small Business Operations Platform (CargoFlow) – Backend

This is the **FastAPI backend** for a Small Business Operations Platform that manages shipments, delivery agents and business clients.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

---

### 2. Create virtual environment (uv)

```bash
uv venv
.venv\Scripts\activate
```

---

### 3. Install dependencies

```bash
uv sync
```

---

### 4. Run the server

```bash
uvicorn app.main:app --reload
```

---

### 5. Access API docs

```
http://127.0.0.1:8000/docs
```

---

## 6. Running Tests

```bash
python -m pytest -v
```

---

## 7. Test Coverage

```bash
python -m pytest --cov=app --cov-report=term-missing
```

---

## Roles in System

| Role            | Permissions                        |
| --------------- | ---------------------------------- |
| Admin           | Manage shipments, agents, clients  |
| Delivery Agent  | Deliver shipments, update location |
| Business Client | Create & track shipments           |