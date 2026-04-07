import os
from typing import Dict, Any

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from .embeddings import build_and_save, load, retrieve, get_model

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
LLM_MODEL = "Qwen/Qwen2.5-7B-Instruct"


SYSTEM_PROMPT = """You are a professional customer support assistant for CargoFlow logistics company.

Rules:
- Answer ONLY from provided context
- If unknown, say you don't know
- Be concise and helpful
- Pricing is ₹45 per kg unless specified otherwise
"""


def call_llm(context, question):
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


class CargoFlowRAG:

    def __init__(self):
        if not os.path.exists("chatbot/vector_store/index.faiss"):
            self.index, self.chunks, self.model = build_and_save()
        else:
            self.index, self.chunks = load()
            self.model = get_model()

    def query(self, question: str, top_k: int = 5) -> Dict[str, Any]:

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