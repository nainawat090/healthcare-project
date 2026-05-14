from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import get_ai_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):
    """
    AI chatbot endpoint.
    Accepts full conversation history and returns next assistant reply.
    Uses LLM if API key is set, otherwise falls back to rule-based engine.
    """
    return await get_ai_response(request)
