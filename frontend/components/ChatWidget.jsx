"use client";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function sendMessage(message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm the fitness.com assistant. Ask me about Zumba, Yoga, Strength Training, or Fitness Training." },
  ]);
  const endRef = useRef(null);

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, something went wrong. Try again in a moment." }]);
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    mutation.mutate(input);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 h-96 bg-charcoal2 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-coral px-4 py-3 flex items-center justify-between">
            <span className="font-display text-sm text-charcoal">fitness.com assistant</span>
            <button onClick={() => setOpen(false)} className="text-charcoal font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl ${
                  m.role === "user" ? "bg-coral text-charcoal ml-auto" : "bg-white/10 text-bone"
                }`}
              >
                {m.text}
              </div>
            ))}
            {mutation.isPending && <div className="text-bone/50 text-xs px-1">typing…</div>}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about a course…"
              className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm outline-none text-bone placeholder:text-bone/40"
            />
            <button
              onClick={handleSend}
              className="bg-coral text-charcoal px-3 py-2 rounded-lg text-sm font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-coral text-charcoal text-2xl font-bold shadow-xl flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
