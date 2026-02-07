from fastapi import FastAPI
from .database import Base, engine
from . import models
from .routes import user_routes

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_routes.router)

@app.get("/")
def health():
    return {"status": "API working"}