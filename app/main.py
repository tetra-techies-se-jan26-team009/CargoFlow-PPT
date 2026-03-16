from fastapi import FastAPI
from .database import Base, engine, SessionLocal
from .models import User, UserRole
from .routes import user_routes, auth_routes, admin_routes
from .auth import hash_password
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()

# app.include_router(user_routes.router)
app.include_router(auth_routes.router)
app.include_router(admin_routes.router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

    if not admin:
        new_admin = User(name="Admin",
                         email=os.getenv("ADMIN_EMAIL"),
                         password_hash=hash_password(os.getenv("ADMIN_PASSWORD")),
                         phone=os.getenv("ADMIN_PHONE"),
                         role=UserRole.ADMIN,
                         is_active=True)
        db.add(new_admin)
        db.commit()
    db.close()

@app.get("/health")
def health():
    return {"status": "API working"}