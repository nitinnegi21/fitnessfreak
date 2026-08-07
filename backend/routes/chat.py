from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse
from services.llm import get_llm_reply

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = await get_llm_reply(req.message)
    return ChatResponse(reply=reply)
