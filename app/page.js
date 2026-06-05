import Navbar from "@/components/Navbar";
import Link from "next/link";

const features = [
  {
    icon: "🧠",
    label: "XGBoost + Random Forest",
    desc: "Ensemble ML classification on multidimensional skill matrices",
  },
  {
    icon: "🤖",
    label: "Generative AI Orchestration",
    desc: "LLM-powered personalized skill acquisition roadmaps",
  },
  {
    icon: "🔍",
    label: "Sentence-BERT Semantics",
    desc: "Cosine similarity scoring for resume-JD alignment",
  },
  {
    icon: "📊",
    label: "Real-time Gap Analysis",
    desc: "Identify skill deltas against market expectations instantly",
  },
];

const modules = [
  {
    num: "01",
    icon: "🎯",
    title: "Predictive Job Matching",
    desc: "Rate your skills across 20 dimensions. Our ensemble ML model instantly maps you to the most aligned career tracks from our occupational profile database.",
    href: "/job-match",
    gradient: "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(6,182,212,0.05))",
    border: "rgba(79,142,247,0.2)",
    class: "module-card-1",
    tags: ["Multi-Class Classification", "XGBoost", "Skill Vectors"],
  },
  {
    num: "02",
    icon: "🗺️",
    title: "Skill Gap Analysis",
    desc: "Uncover the exact competency deltas between where you are and where the role demands you to be — with a month-by-month AI learning roadmap.",
    href: "/skill-gap",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,142,247,0.05))",
    border: "rgba(124,58,237,0.2)",
    class: "module-card-2",
    tags: ["Gap Analysis", "LLM Roadmap", "Generative AI"],
  },
  {
    num: "03",
    icon: "📄",
    title: "Intelligent Resume Optimizer",
    desc: "Upload your PDF resume, paste a job description — our AI computes semantic similarity scores and rewrites weak bullet points using the STAR method.",
    href: "/resume",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.05))",
    border: "rgba(16,185,129,0.2)",
    class: "module-card-3",
    tags: ["Sentence-BERT", "PDF Parsing", "NLP Optimization"],
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="hero-content" style={{ width: "100%" }}>
          <div className="hero-eyebrow">
            <span>✨</span> AI-POWERED CAREER ECOSYSTEM
          </div>

          <h1 className="hero-title">
            Navigate Your Career<br />
            <span className="shimmer-text">With AI Precision</span>
          </h1>

          <p className="hero-desc">
            NextGen CareerNav dynamically aligns your individual competencies with real-world
            workforce demands using predictive ML, generative AI, and semantic NLP — making
            strategic career development accessible to everyone.
          </p>

          <div className="hero-actions">
            <Link href="/job-match" className="btn btn-primary btn-lg">
              🚀 Start Job Matching
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg">
              📊 View Dashboard
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">20+</span>
              <span className="hero-stat-label">Career Profiles</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">20</span>
              <span className="hero-stat-label">Skills Assessed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">6-Mo</span>
              <span className="hero-stat-label">AI Roadmaps</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">3</span>
              <span className="hero-stat-label">AI Modules</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES ──────────────────────────────────────── */}
      <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: 640, margin: "0 auto 56px" }}>
            <div className="section-eyebrow">Three Intelligent Modules</div>
            <h2 className="section-title">
              A Complete Career Intelligence{" "}
              <span className="gradient-text">Ecosystem</span>
            </h2>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              Three interdependent AI modules working in concert to give you a 360° view of your
              career trajectory, skill gaps, and resume effectiveness.
            </p>
          </div>

          <div className="module-cards-grid">
            {modules.map((m) => (
              <Link
                key={m.num}
                href={m.href}
                className={`glass-card module-card ${m.class}`}
                style={{ background: m.gradient, borderColor: m.border }}
              >
                <span className="module-card-number">MODULE {m.num}</span>
                <span className="module-card-icon">{m.icon}</span>
                <h3 className="module-card-title">{m.title}</h3>
                <p className="module-card-desc">{m.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {m.tags.map((t) => (
                    <span key={t} className="badge badge-blue" style={{ fontSize: "0.65rem" }}>{t}</span>
                  ))}
                </div>
                <span className="module-card-cta">
                  Launch Module <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ padding: "0 0 100px", position: "relative", zIndex: 1 }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: "56px",
              background: "linear-gradient(135deg, rgba(79,142,247,0.06), rgba(124,58,237,0.04))",
              border: "1px solid rgba(79,142,247,0.15)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="section-eyebrow">Under The Hood</div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>
                  Built on Cutting-Edge{" "}
                  <span className="gradient-text">AI Architecture</span>
                </h2>
                <p className="section-desc">
                  NextGen CareerNav integrates supervised ensemble learning, large language model
                  orchestration, and semantic transformer architectures into a seamless multi-tiered
                  AI engine.
                </p>
                <div style={{ marginTop: 32 }}>
                  <Link href="/job-match" className="btn btn-primary">
                    Try the Platform →
                  </Link>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="glass-card"
                    style={{ padding: 20, cursor: "default" }}
                  >
                    <span style={{ fontSize: "1.8rem", display: "block", marginBottom: 10 }}>{f.icon}</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {f.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "32px 0",
        position: "relative", zIndex: 1,
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="logo-icon" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>🚀</div>
            <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "0.95rem" }}>
              NextGen <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>CareerNav</span>
            </span>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            AI-Powered Career Ecosystem · Built with Next.js + ML
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Keywords: Predictive Analytics", "Career Navigation", "Semantic Match", "LLMs"].map((k) => (
              <span key={k} style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{k}</span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
