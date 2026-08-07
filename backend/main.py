from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.whatsapp import router as whatsapp_router

app = FastAPI(title="fitness.com API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(whatsapp_router)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "fitness.com API running"}
