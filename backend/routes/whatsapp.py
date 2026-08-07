from fastapi import APIRouter, Request, HTTPException
from config import VERIFY_TOKEN
from services.llm import get_llm_reply
from services.whatsapp import resolve_reply, send_message

router = APIRouter(prefix="/webhook", tags=["WhatsApp"])


@router.get("/whatsapp")
async def verify_webhook(request: Request):
    """Meta calls this once to verify the webhook URL."""
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge", 0))
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/whatsapp")
async def receive_whatsapp(request: Request):
    """
    Incoming WhatsApp message handler.

    Decision tree:
      greeting / 'menu'      → welcome menu
      number 1-4 / course name → course detail card
      anything else          → Groq LLM reply
    """
    body = await request.json()

    try:
        entry       = body["entry"][0]["changes"][0]["value"]
        message     = entry["messages"][0]
        from_number = message["from"]

        if message.get("type") != "text":
            return {"status": "ignored"}

        text = message["text"]["body"].strip()
    except (KeyError, IndexError):
        return {"status": "ignored"}

    # Try pre-built reply first, fall back to LLM
    reply_text = resolve_reply(text) or await get_llm_reply(text)

    await send_message(from_number, reply_text)
    return {"status": "ok"}
