import CourseGrid from "../components/CourseGrid";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-charcoal2 to-charcoal pb-28 pt-16 px-6 md:px-16"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" }}>
        <div
          style={{
            position: "absolute", top: "-8rem", right: "-8rem",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "rgba(255,77,109,0.06)", filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <nav className="flex items-center justify-between mb-20">
          <span className="font-display text-xl tracking-tight text-bone">
            fitness<span className="text-coral">.com</span>
          </span>
          <a href="#courses" className="text-sm font-semibold text-bone/70 hover:text-coral transition">
            View Courses ↓
          </a>
        </nav>
        <div className="max-w-3xl">
          <p className="text-coral font-semibold tracking-widest text-xs mb-4 uppercase">
            Four Paths. One Goal.
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-none text-bone mb-6">
            MOVE WITH<br />
            <span className="text-coral">PURPOSE.</span>
          </h1>
          <p className="text-bone/60 text-lg max-w-xl mb-10">
            Zumba, Yoga, Strength Training, and Fitness Training — four courses,
            one platform, built for people who show up.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#courses"
              className="bg-coral text-charcoal font-bold px-7 py-3 rounded-xl hover:bg-coral2 transition"
              style={{ boxShadow: "0 8px 30px rgba(255,77,109,0.3)" }}>
              Explore Courses
            </a>
            <a href="#whatsapp"
              className="border border-bone/20 text-bone px-7 py-3 rounded-xl hover:border-coral hover:text-coral transition">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Courses (client component handles interactivity) ───────── */}
      <section id="courses" className="px-6 md:px-16 py-24">
        <div className="mb-14">
          <h2 className="font-display text-3xl md:text-4xl text-bone mb-2">The Courses</h2>
          <p className="text-bone/40">Pick a lane. Switch anytime.</p>
        </div>
        <CourseGrid />
      </section>

      {/* ── WhatsApp CTA ───────────────────────────────────────────── */}
      <section id="whatsapp" className="px-6 md:px-16 py-24 bg-charcoal2">
        <div className="max-w-2xl">
          <p className="text-mint text-xs font-bold tracking-widest uppercase mb-3">24 / 7 Support</p>
          <h2 className="font-display text-3xl md:text-4xl text-bone mb-4">Questions? Text us.</h2>
          <p className="text-bone/50 mb-8 text-lg">
            Our WhatsApp assistant handles scheduling, course info, and pricing
            instantly — powered by AI, available at any scale.
          </p>
          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-mint text-charcoal font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition"
            style={{ boxShadow: "0 8px 30px rgba(61,220,151,0.25)" }}
          >
            {/* WhatsApp icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message us on WhatsApp
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-16 py-10 flex items-center justify-between text-bone/30 text-sm"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="font-display text-bone/50">
          fitness<span className="text-coral/60">.com</span>
        </span>
        <span>© {new Date().getFullYear()} — Move with purpose.</span>
      </footer>

      <ChatWidget />
    </main>
  );
}
