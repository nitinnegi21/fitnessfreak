# fitness.com — Quick Deploy Guide

## Frontend (Next.js + Tailwind + TanStack Query)

```bash
cd frontend
npm install
npm run dev        # local test on http://localhost:3000
```

**Fastest deploy (Vercel, ~2 min):**
```bash
npm install -g vercel
vercel
```
Follow the prompts — it auto-detects Next.js. Set `NEXT_PUBLIC_API_BASE`
env var in Vercel's dashboard to your deployed backend URL once you have it.

## Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt --break-system-packages
uvicorn main:app --reload --port 8000   # local test
```

**Fastest deploy options:**
- **Render.com**: New Web Service → connect repo → build command
  `pip install -r requirements.txt` → start command
  `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Railway.app**: even faster, auto-detects Python + FastAPI, just push and go.

## Environment variables (backend)

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` (or swap for `ANTHROPIC_API_KEY`) | Enables real LLM-powered chat replies. Without it, the bot uses simple rule-based replies (still fully functional demo). |
| `WHATSAPP_TOKEN` | Meta WhatsApp Business Cloud API access token |
| `WHATSAPP_PHONE_ID` | Your WhatsApp Business phone number ID from Meta |
| `WHATSAPP_VERIFY_TOKEN` | Any string you choose — used once to verify the webhook URL with Meta |

## WhatsApp integration — what's actually needed

1. Create a Meta for Developers app → add WhatsApp product.
2. Get a test phone number ID + temporary access token (free tier for testing).
3. Set webhook URL in Meta's dashboard to: `https://your-backend-url/webhook/whatsapp`
4. Set the verify token to match `WHATSAPP_VERIFY_TOKEN`.
5. Once verified, incoming messages hit `/webhook/whatsapp` and auto-reply.

## Scaling notes (for the "million users" requirement)

The backend is fully stateless (no in-memory session data), so it scales
horizontally — just run more instances behind a load balancer. For real
production scale, add:
- A Redis-backed task queue (Celery/RQ) so slow LLM calls don't block the
  webhook response (Meta requires a fast 200 OK).
- Rate limiting per WhatsApp number to control cost.
- A proper database (Postgres) for conversation history instead of
  the current stateless design, if conversation memory is needed.

## Images

Course images currently use placeholder photos (picsum.photos) — swap
these for licensed stock photography (Unsplash/Pexels, both free-to-use
with attribution per their license) or your own photography before
production launch. Avoid pulling images directly from Pinterest — most
of that content is re-pinned from other sources and not cleared for
commercial reuse.
