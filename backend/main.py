"""
fitness.com backend — FastAPI
- /api/chat          -> website chat widget (Groq LLM)
- /webhook/whatsapp  -> WhatsApp Business API webhook (Meta Cloud API)

WhatsApp flow:
  1. User sends any first message → welcome menu with 4 course options
  2. User replies with a number (1-4) or types a course name → course detail card
  3. Any other message → Groq LLM gives a contextual answer
  4. User types "menu" or "hi" at any time → menu shown again
"""

import os
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="fitness.com API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Config ────────────────────────────────────────────────────────────────────
WHATSAPP_TOKEN    = os.getenv("WHATSAPP_TOKEN", "")
WHATSAPP_PHONE_ID = os.getenv("WHATSAPP_PHONE_ID", "")
VERIFY_TOKEN      = os.getenv("WHATSAPP_VERIFY_TOKEN", "fitnesscom-verify")
GROQ_API_KEY      = os.getenv("GROQ_API_KEY", "")

# ── Course data ───────────────────────────────────────────────────────────────
COURSES = [
    {
        "name": "Zumba",
        "emoji": "💃",
        "tag": "Dance • Cardio",
        "price": "₹399/month",
        "desc": (
            "High-energy dance cardio set to Latin & international music. "
            "60-minute sessions, all fitness levels welcome. Burns 400–600 kcal/session."
        ),
    },
    {
        "name": "Yoga",
        "emoji": "🧘",
        "tag": "Flexibility • Mind",
        "price": "₹299/month",
        "desc": (
            "Breath-led movement and stillness. Beginner to advanced tracks covering "
            "Hatha, Vinyasa, and Yin styles. Great for stress, posture, and mobility."
        ),
    },
    {
        "name": "Strength Training",
        "emoji": "🏋️",
        "tag": "Power • Muscle",
        "price": "₹499/month",
        "desc": (
            "Progressive overload programming to build real, lasting strength. "
            "Includes compound lifts, periodisation plans, and nutrition guidance."
        ),
    },
    {
        "name": "Fitness Training",
        "emoji": "🔥",
        "tag": "Conditioning • All-round",
        "price": "₹399/month",
        "desc": (
            "Full-body conditioning blending HIIT, mobility work, and functional "
            "movements. Ideal if you want overall fitness without specialising."
        ),
    },
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def welcome_menu() -> str:
    """The main menu message sent on first contact or when user types 'menu'."""
    lines = [
        "👋 Welcome to *fitness.com*!",
        "We offer four world-class courses to help you move with purpose.\n",
        "Reply with a *number* to learn more:\n",
    ]
    for i, c in enumerate(COURSES, 1):
        lines.append(f"{i}. {c['emoji']} *{c['name']}* — {c['price']}")
    lines += [
        "",
        "Or just ask me anything about fitness! 💬",
        "_Type *menu* anytime to see this again._",
    ]
    return "\n".join(lines)


def course_detail(course: dict) -> str:
    """Formatted detail card for a single course."""
    return (
        f"{course['emoji']} *{course['name']}*\n"
        f"_{course['tag']}_\n\n"
        f"{course['desc']}\n\n"
        f"💰 *Price:* {course['price']}\n\n"
        f"👉 Enroll at https://fitness.com or reply *menu* to explore other courses."
    )


def match_course_from_text(text: str) -> dict | None:
    """Returns a course dict if the user's message matches by number or name."""
    t = text.strip().lower()

    # number shortcuts: "1", "2", "3", "4"
    if t in {"1", "2", "3", "4"}:
        return COURSES[int(t) - 1]

    # name match (partial)
    for c in COURSES:
        if c["name"].lower() in t:
            return c

    return None


def is_greeting(text: str) -> bool:
    greetings = {"hi", "hello", "hey", "hii", "helo", "start", "menu", "help"}
    return text.strip().lower() in greetings


# ── LLM ───────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = (
    "You are the WhatsApp assistant for fitness.com. "
    "The platform offers four courses:\n"
    "1. Zumba (₹399/month) — high-energy dance cardio\n"
    "2. Yoga (₹299/month) — flexibility and mindfulness\n"
    "3. Strength Training (₹499/month) — progressive overload for muscle\n"
    "4. Fitness Training (₹399/month) — full-body conditioning\n\n"
    "Answer questions about courses, pricing, schedules, and general fitness. "
    "Keep replies short (under 100 words), warm, and WhatsApp-friendly (use *bold* sparingly). "
    "Do not discuss topics unrelated to fitness. "
    "End every reply with a nudge to type *menu* if they want to see all courses."
)


async def call_llm(message: str) -> str:
    if not GROQ_API_KEY:
        return (
            "I can help with Zumba, Yoga, Strength Training, and Fitness Training. "
            "Type *menu* to see all courses and prices!"
        )

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ],
                "max_tokens": 200,
                "temperature": 0.7,
            },
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()


# ── Website chat endpoint ─────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = await call_llm(req.message)
    return ChatResponse(reply=reply)


# ── WhatsApp webhook ──────────────────────────────────────────────────────────

@app.get("/webhook/whatsapp")
async def verify_webhook(request: Request):
    """Meta calls this once to verify your webhook URL."""
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge", 0))
    raise HTTPException(status_code=403, detail="Verification failed")


@app.post("/webhook/whatsapp")
async def receive_whatsapp(request: Request):
    """
    Receives incoming WhatsApp messages and replies.

    Flow:
      greeting / 'menu'  → welcome_menu()
      number 1-4 / course name → course_detail()
      anything else      → Groq LLM reply
    """
    body = await request.json()

    try:
        entry   = body["entry"][0]["changes"][0]["value"]
        message = entry["messages"][0]
        from_number = message["from"]

        # Only handle text messages; ignore reactions, images, etc.
        if message.get("type") != "text":
            return {"status": "ignored"}

        text = message["text"]["body"].strip()
    except (KeyError, IndexError):
        return {"status": "ignored"}

    # ── Decision tree ──────────────────────────────────────────────────────
    if is_greeting(text):
        reply_text = welcome_menu()

    elif course := match_course_from_text(text):
        reply_text = course_detail(course)

    else:
        # Full LLM answer for anything else
        reply_text = await call_llm(text)

    await send_whatsapp_message(from_number, reply_text)
    return {"status": "ok"}


async def send_whatsapp_message(to: str, text: str):
    """Send a plain-text WhatsApp message via Meta Graph API."""
    if not WHATSAPP_TOKEN or not WHATSAPP_PHONE_ID:
        # Dry-run: log to console so you can test without credentials
        print(f"\n[DRY RUN → {to}]\n{text}\n{'─'*50}")
        return

    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"https://graph.facebook.com/v19.0/{WHATSAPP_PHONE_ID}/messages",
            headers={"Authorization": f"Bearer {WHATSAPP_TOKEN}"},
            json={
                "messaging_product": "whatsapp",
                "to": to,
                "text": {"body": text},
            },
            timeout=10,
        )
        if r.status_code != 200:
            print(f"[WhatsApp send error] {r.status_code}: {r.text}")


@app.get("/")
async def root():
    return {"status": "fitness.com API running"}
