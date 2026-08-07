import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT =
  "You are the assistant for fitness.com. " +
  "The platform offers four courses:\n" +
  "1. Zumba (₹399/month) — high-energy dance cardio\n" +
  "2. Yoga (₹299/month) — flexibility and mindfulness\n" +
  "3. Strength Training (₹499/month) — progressive overload for muscle\n" +
  "4. Fitness Training (₹399/month) — full-body conditioning\n\n" +
  "Answer questions about courses, pricing, schedules, and general fitness. " +
  "Keep replies concise and warm. Do not discuss unrelated topics.";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Please send a message." }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({
        reply:
          "I can help with Zumba, Yoga, Strength Training, and Fitness Training. Ask me anything!",
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq error:", err);
      return NextResponse.json(
        { reply: "Sorry, the AI is unavailable right now. Try again in a moment." },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const reply = data.choices[0].message.content.trim();
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Try again in a moment." },
      { status: 500 }
    );
  }
}
