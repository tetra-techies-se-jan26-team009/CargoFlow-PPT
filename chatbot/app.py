from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from .rag_pipeline import SwiftShipRAG

# ── Router (IMPORTANT CHANGE) ─────────────────────────────────────────
router = APIRouter()

# ── Shared pipeline instance ─────────────────────────────────────────
rag: Optional[SwiftShipRAG] = None


@asynccontextmanager
async def lifespan():
    global rag
    print("[chatbot] Loading RAG pipeline...")
    rag = SwiftShipRAG()
    print("[chatbot] Ready.")
    yield


# ── Schemas ──────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500)
    top_k: int = Field(default=5, ge=1, le=10)


class SourceChunk(BaseModel):
    text: str
    score: float


class ChatResponse(BaseModel):
    question: str
    answer: str
    found_in_kb: bool
    sources: List[SourceChunk]


class HealthResponse(BaseModel):
    status: str
    chunks_loaded: int
    llm_model: str


class RebuildResponse(BaseModel):
    message: str
    chunks_loaded: int


# ── Endpoints ─────────────────────────────────────────────────────────

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Ask chatbot",
    tags=["Chatbot"],
)
async def chat(request: ChatRequest):
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    try:
        result = rag.query(request.question.strip(), top_k=request.top_k)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(
        question=result["question"],
        answer=result["answer"],
        found_in_kb=result["found_in_kb"],
        sources=[
            SourceChunk(text=text, score=round(score, 4))
            for text, score in result["sources"]
        ],
    )


@router.get(
    "/chatbot/health",
    response_model=HealthResponse,
    summary="Chatbot health",
    tags=["System"],
)
async def chatbot_health():
    return HealthResponse(
        status="ok",
        chunks_loaded=len(rag.chunks) if rag else 0,
        llm_model=rag.model_name if rag else "not loaded",
    )


@router.post(
    "/rebuild",
    response_model=RebuildResponse,
    summary="Rebuild chatbot index",
    tags=["System"],
)
async def rebuild():
    try:
        rag.rebuild()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return RebuildResponse(
        message="Rebuilt successfully",
        chunks_loaded=len(rag.chunks),
    )