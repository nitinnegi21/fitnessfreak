"use client";
import { useState } from "react";

const COURSES = [
  {
    name: "Zumba",
    tag: "Dance • Cardio",
    emoji: "💃",
    desc: "High-energy dance cardio set to music that makes 60 minutes feel like 10.",
    image: "/zumba.jpg",
    price: "₹399",
    amount: 39900,
  },
  {
    name: "Yoga",
    tag: "Flexibility • Mind",
    emoji: "🧘",
    desc: "Breath-led movement and stillness — build flexibility, calm the noise.",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&h=750&fit=crop&q=80",
    price: "₹299",
    amount: 29900,
  },
  {
    name: "Strength Training",
    tag: "Power • Muscle",
    emoji: "🏋️",
    desc: "Progressive overload programming to build real, lasting strength.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=750&fit=crop&q=80",
    price: "₹499",
    amount: 49900,
  },
  {
    name: "Fitness Training",
    tag: "Conditioning • All-round",
    emoji: "🔥",
    desc: "Full-body conditioning blending cardio, mobility, and functional work.",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=750&fit=crop&q=80",
    price: "₹399",
    amount: 39900,
  },
];

const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CourseCard({ course }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    const ok = await loadRazorpay();
    if (!ok) {
      setLoading(false);
      alert("Could not load payment gateway. Check your connection.");
      return;
    }
    const rzp = new window.Razorpay({
      key: RZP_KEY,
      amount: course.amount,
      currency: "INR",
      name: "fitness.com",
      description: `${course.name} — per month`,
      theme: { color: "#FF4D6D" },
      handler: (res) => {
        setLoading(false);
        alert(`✅ Payment successful!\nID: ${res.razorpay_payment_id}\n\nWelcome to ${course.name}!`);
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });
    rzp.on("payment.failed", (r) => {
      setLoading(false);
      alert(`❌ Payment failed: ${r.error.description}`);
    });
    rzp.open();
    setLoading(false); // modal is open, button can reset
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#1D2026",
        borderRadius: "24px",
        overflow: "hidden",
        border: hovered ? "1px solid rgba(255,77,109,0.4)" : "1px solid rgba(255,255,255,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(255,77,109,0.15)" : "0 2px 20px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "260px", overflow: "hidden", background: "#14161A" }}>
        {!imgError ? (
          <img
            src={course.image}
            alt={course.name}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          /* Fallback when image fails to load */
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #1D2026 0%, #14161A 100%)",
            fontSize: "72px",
          }}>
            {course.emoji}
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(20,22,26,0.9) 0%, transparent 50%)",
        }} />

        {/* Price badge */}
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: "rgba(20,22,26,0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,77,109,0.35)",
          borderRadius: "14px",
          padding: "6px 12px",
          textAlign: "center",
        }}>
          <div style={{ color: "#FF4D6D", fontWeight: "700", fontSize: "16px", lineHeight: 1 }}>
            {course.price}
          </div>
          <div style={{ color: "rgba(243,241,236,0.5)", fontSize: "9px", letterSpacing: "0.08em", marginTop: "3px" }}>
            PER MONTH
          </div>
        </div>

        {/* Emoji badge */}
        <div style={{ position: "absolute", bottom: "12px", left: "14px", fontSize: "24px" }}>
          {course.emoji}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ color: "#FF4D6D", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
          {course.tag}
        </p>
        <h3 style={{ color: "#F3F1EC", fontSize: "20px", fontWeight: "900", marginBottom: "8px", lineHeight: 1.2 }}>
          {course.name}
        </h3>
        <p style={{ color: "rgba(243,241,236,0.5)", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px", flex: 1 }}>
          {course.desc}
        </p>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "14px" }}>
          <span style={{ color: "#F3F1EC", fontSize: "26px", fontWeight: "900" }}>{course.price}</span>
          <span style={{ color: "rgba(243,241,236,0.35)", fontSize: "13px" }}>/month</span>
        </div>

        {/* Enroll button */}
        <button
          onClick={handleEnroll}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#cc3d58" : "#FF4D6D",
            color: "#14161A",
            fontWeight: "700",
            fontSize: "14px",
            padding: "12px",
            borderRadius: "14px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(255,77,109,0.3)",
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? (
            <>
              {/* Spinning circle */}
              <svg
                width="16" height="16"
                viewBox="0 0 16 16"
                style={{ animation: "spin 0.8s linear infinite" }}
              >
                <circle
                  cx="8" cy="8" r="6"
                  fill="none"
                  stroke="#14161A"
                  strokeWidth="2.5"
                  strokeDasharray="28"
                  strokeDashoffset="10"
                  strokeLinecap="round"
                />
              </svg>
              Opening payment…
            </>
          ) : (
            `Enroll Now — ${course.price}`
          )}
        </button>

        {/* Keyframe for spinner */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function CourseGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "28px",
    }}>
      {COURSES.map((c) => <CourseCard key={c.name} course={c} />)}
    </div>
  );
}
