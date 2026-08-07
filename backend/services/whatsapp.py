"""
WhatsApp service — message building and sending via Meta Graph API.
"""

import httpx
from config import WHATSAPP_TOKEN, WHATSAPP_PHONE_ID
from models.course import Course, get_all_courses, find_course_by_text

GREETINGS = {"hi", "hello", "hey", "hii", "helo", "start", "menu", "help"}


def is_greeting(text: str) -> bool:
    return text.strip().lower() in GREETINGS


def build_welcome_menu() -> str:
    lines = [
        "👋 Welcome to *fitness.com*!",
        "We offer four world-class courses to help you move with purpose.\n",
        "Reply with a *number* to learn more:\n",
    ]
    for i, c in enumerate(get_all_courses(), 1):
        lines.append(f"{i}. {c.emoji} *{c.name}* — {c.price}")
    lines += [
        "",
        "Or ask me anything about fitness! 💬",
        "_Type *menu* anytime to see this again._",
    ]
    return "\n".join(lines)


def build_course_detail(course: Course) -> str:
    return (
        f"{course.emoji} *{course.name}*\n"
        f"_{course.tag}_\n\n"
        f"{course.desc}\n\n"
        f"💰 *Price:* {course.price}\n\n"
        f"👉 Enroll at https://fitnessfreak-sooty.vercel.app or reply *menu* to explore more."
    )


def resolve_reply(text: str) -> str | None:
    """
    Returns a pre-built reply string if the message matches a greeting or
    course lookup. Returns None if it should fall through to the LLM.
    """
    if is_greeting(text):
        return build_welcome_menu()
    course = find_course_by_text(text)
    if course:
        return build_course_detail(course)
    return None


async def send_message(to: str, text: str) -> None:
    """Send a WhatsApp text message via Meta Graph API."""
    if not WHATSAPP_TOKEN or not WHATSAPP_PHONE_ID:
        print(f"\n[DRY RUN → {to}]\n{text}\n{'─' * 50}")
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
