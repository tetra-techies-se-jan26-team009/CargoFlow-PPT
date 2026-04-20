import re
import os
from typing import Dict, Any

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from app.database import SessionLocal
from app.models import Shipment, TrackingUpdate

from .embeddings import build_and_save, load, retrieve, get_model

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
LLM_MODEL = "Qwen/Qwen2.5-7B-Instruct"


SYSTEM_PROMPT = """You are a smart logistics assistant for CargoFlow.

Capabilities:
- Answer from knowledge base
- Track shipments using tracking ID
- Calculate shipping cost (₹45 per kg)

Rules:
- If tracking ID is given → track shipment
- If weight is given → calculate price
- Otherwise → answer from knowledge base
- Be concise and helpful
"""


# ---------------- HELPERS ---------------- 

def extract_tracking_id(text: str):
    match = re.search(r"CF-\d{8}-\d{4}", text)
    return match.group(0) if match else None


def extract_weight(text: str):
    match = re.search(r"(\d+)\s*kg", text.lower())
    return int(match.group(1)) if match else None


# ---------------- FEATURES ---------------- 

def handle_tracking(tracking_id: str):
    if not tracking_id:
        return {
            "answer": "Please provide a valid tracking ID",
            "sources": [],
            "found_in_kb": False
        }

    db = SessionLocal()

    try:
        shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_id).first()
        if not shipment:
            return {
                "answer": "Tracking ID not found",
                "sources": [],
                "found_in_kb": False
            }

        progress_map = {
            "CREATED": 10,
            "ASSIGNED": 40,
            "OUT_FOR_DELIVERY": 80,
            "DELIVERED": 100
        }

        progress = progress_map.get(shipment.status.value, 0)

        pickup_city = shipment.pickup_address.city if shipment.pickup_address else "N/A"
        delivery_city = shipment.delivery_address.city if shipment.delivery_address else "N/A"

        latest_tracking = db.query(TrackingUpdate)\
            .filter(TrackingUpdate.shipment_id == shipment.id)\
            .order_by(TrackingUpdate.timestamp.desc())\
            .first()

        lat = latest_tracking.latitude if latest_tracking else "N/A"
        lng = latest_tracking.longitude if latest_tracking else "N/A"

        return {
            "answer": (
                f"Tracking ID: {shipment.tracking_number}\n"
                f"Status: {shipment.status.value}\n"
                f"From: {pickup_city}\n"
                f"To: {delivery_city}\n"
                f"Progress: {progress}%\n"
                f"Current Location: ({lat}, {lng})\n"
                f"Map: https://www.google.com/maps?q={lat},{lng}"
            ),
            "sources": [],
            "found_in_kb": False
        }

    finally:
        db.close()


def handle_price(weight: int):
    if not weight:
        return {
            "answer": "Please provide weight (e.g., cost for 5kg)",
            "sources": [],
            "found_in_kb": False
        }

    cost = weight * 45

    return {
        "answer": f"Estimated cost for {weight} kg is ₹{cost}",
        "sources": [],
        "found_in_kb": False
    }


# ---------------- LLM ---------------- 

def call_llm(context: str, question: str):
    client = InferenceClient(token=HF_API_TOKEN)

    response = client.chat_completion(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"{context}\n\nQuestion: {question}"}
        ],
        max_tokens=300,
        temperature=0.2,
    )

    return response.choices[0].message.content


# ---------------- MAIN CLASS ---------------- 

class CargoFlowRAG:

    def __init__(self):
        if not os.path.exists("chatbot/vector_store/index.faiss"):
            self.index, self.chunks, self.model = build_and_save()
        else:
            self.index, self.chunks = load()
            self.model = get_model()

    def query(self, question: str, top_k: int = 5) -> Dict[str, Any]:

        q = question.lower()

        if any(word in q for word in ["hi", "hello", "hey", "hii", "helo"]):
            return {
                "question": question,
                "answer": "Hello! How can I help you with your shipment today?",
                "sources": [],
                "found_in_kb": False
            }


        tracking_id = extract_tracking_id(question)
        if tracking_id:
            result = handle_tracking(tracking_id)

            return {
                "question": question,
                "answer": result["answer"],
                "sources": [],
                "found_in_kb": False
            }


        weight = extract_weight(question)
        if any(word in q for word in ["cost", "price", "charge", "fee"]) and weight:
            result = handle_price(weight)

            return {
                "question": question,
                "answer": result["answer"],
                "sources": [],
                "found_in_kb": False
            }


        sources = retrieve(question, self.index, self.chunks, self.model, top_k)

        if not sources:
            return {
                "question": question,
                "answer": "Sorry, I don't have that information.",
                "sources": [],
                "found_in_kb": False
            }

        context = "\n\n".join([c for c, _ in sources])
        answer = call_llm(context, question)

        return {
            "question": question,
            "answer": answer,
            "sources": sources,
            "found_in_kb": True
        }

    def rebuild(self):
        self.index, self.chunks, self.model = build_and_save()