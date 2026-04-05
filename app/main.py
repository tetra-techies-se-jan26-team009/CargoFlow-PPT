from fastapi import FastAPI
from .database import Base, engine, SessionLocal
from .models import User, UserRole
from .routes import auth_routes, admin_routes, client_routes, agent_routes

from chatbot.app import router as chatbot_router
import chatbot.app as chatbot_module
from chatbot.rag_pipeline import SwiftShipRAG

from .auth import hash_password
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.include_router(auth_routes.router)
app.include_router(admin_routes.router)
app.include_router(client_routes.router)
app.include_router(agent_routes.router)
app.include_router(chatbot_router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

    if not admin:
        new_admin = User(
            name="Admin",
            email=os.getenv("ADMIN_EMAIL"),
            password_hash=hash_password(os.getenv("ADMIN_PASSWORD")),
            phone=os.getenv("ADMIN_PHONE"),
            role=UserRole.ADMIN,
            is_active=True)
        db.add(new_admin)
        db.commit()
    db.close()

    print("[main] Initializing Chatbot RAG...")
    chatbot_module.rag = SwiftShipRAG()
    print("[main] Chatbot Ready")

@app.get("/health")
def health():
    return {"status": "API working"}