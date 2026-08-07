"""
LLM service — Groq (llama-3.1-8b-instant).
Swap model or provider here without touching routes.
"""

import httpx
from config import GROQ_API_KEY

SYSTEM_PROMPT = (
    "You are the assistant for fitness.com. "
    "The platform offers four courses:\n"
    "1. Zumba (₹399/month) — high-energy dance cardio\n"
    "2. Yoga (₹299/month) — flexibility and mindfulness\n"
    "3. Strength Training (₹499/month) — progressive overload for muscle\n"
    "4. Fitness Training (₹399/month) — full-body conditioning\n\n"
    "Answer questions about courses, pricing, schedules, and general fitness. "
    "Keep replies concise and warm. Do not discuss unrelated topics. "
    "End every reply with a nudge to type *menu* to see all courses."
)

FALLBACK = (
    "I can help with Zumba, Yoga, Strength Training, and Fitness Training. "
    "Type *menu* to see all courses and prices!"
)


async def get_llm_reply(message: str) -> str:
    """Call Groq and return the assistant reply. Falls back gracefully."""
    if not GROQ_API_KEY:
        return FALLBACK

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
                "max_tokens": 250,
                "temperature": 0.7,
            },
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()
