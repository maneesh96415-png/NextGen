"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const quickActions = [
  { icon: "🎯", label: "Run Job Match", href: "/job-match", color: "var(--accent-blue)" },
  { icon: "🗺️", label: "Analyze Skill Gap", href: "/skill-gap", color: "#a78bfa" },
  { icon: "📄", label: "Optimize Resume", href: "/resume", color: "var(--accent-emerald)" },
];

const activityFeed = [
  { icon: "🎯", text: "Job Match completed — Top match: Data Scientist (94%)", time: "2 hours ago", color: "var(--accent-blue)" },
  { icon: "🗺️", text: "6-month roadmap generated for ML Engineer role", time: "1 day ago", color: "#a78bfa" },
  { icon: "📄", text: "Resume optimized — Score improved from 42 → 78", time: "3 days ago", color: "var(--accent-emerald)" },
  { icon: "⚡", text: "Profile skills updated across 20 dimensions", time: "5 days ago", color: "var(--accent-amber)" },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [matchResults, setMatchResults] = useState(null);

  useEffect(() => {
    setMounted(true);
    try {
      const savedProfile = localStorage.getItem("cn_user_profile");
      const savedMatches = localStorage.getItem("cn_match_results");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedMatches) setMatchResults(JSON.parse(savedMatches));
    } catch {}
  }, []);

  const hasData = mounted && profile;

  const stats = [
    {
      icon: "🎯",
      label: "Best Job Match",
      value: hasData && matchResults ? `${matchResults[0]?.matchScore}%` : "—",
      sub: hasData && matchResults ? matchResults[0]?.title : "Run job match first",
      color: "rgba(79,142,247,0.15)",
      iconColor: "var(--accent-blue)",
      trend: hasData ? "+12% vs avg" : null,
      trendColor: "var(--accent-emerald)",
    },
    {
      icon: "📊",
      label: "Skills Assessed",
      value: hasData ? "20" : "—",
      sub: "Across 3 categories",
      color: "rgba(124,58,237,0.15)",
      iconColor: "#a78bfa",
      trend: hasData ? "Complete" : null,
      trendColor: "var(--accent-emerald)",
    },
    {
      icon: "🚀",
      label: "Resume Score",
      value: "78",
      sub: "After AI optimization",
      color: "rgba(16,185,129,0.15)",
      iconColor: "var(--accent-emerald)",
      trend: "+36 improvement",
      trendColor: "var(--accent-emerald)",
    },
    {
      icon: "🗺️",
      label: "Roadmap Progress",
      value: hasData ? "Month 1" : "—",
      sub: "Of 6-month plan",
      color: "rgba(245,158,11,0.15)",
      iconColor: "var(--accent-amber)",
      trend: hasData ? "On track" : null,
      trendColor: "var(--accent-emerald)",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">Career Intelligence Hub</div>
            <h1 className="section-title">
              Your Career <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="section-desc">
              {hasData
                ? "Track your career journey across all three AI modules."
                : "Complete the modules below to populate your personalized career insights."}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginBottom: 32 }}>
            {stats.map((s) => (
              <div key={s.label} className="glass-card stat-card">
                <div className="stat-card-icon" style={{ background: s.color }}>
                  <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
                </div>
                <div>
                  <div className="stat-card-value" style={{ color: s.iconColor }}>{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
                </div>
                {s.trend && (
                  <div className="stat-card-trend" style={{ color: s.trendColor, marginTop: "auto" }}>
                    <span>↑</span> {s.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
            {/* Left: Module Status */}
            <div>
              <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>
                  Module Progress
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    {
                      num: "01", label: "Predictive Job Matching",
                      href: "/job-match", icon: "🎯",
                      done: !!(hasData && matchResults),
                      desc: hasData && matchResults ? `Completed · Top: ${matchResults[0]?.title}` : "Not completed yet",
                      color: "var(--accent-blue)",
                    },
                    {
                      num: "02", label: "Skill Gap Analysis",
                      href: "/skill-gap", icon: "🗺️",
                      done: false,
                      desc: "Run job match first, then generate roadmap",
                      color: "#a78bfa",
                    },
                    {
                      num: "03", label: "Resume Optimizer",
                      href: "/resume", icon: "📄",
                      done: false,
                      desc: "Upload your PDF to get AI-powered suggestions",
                      color: "var(--accent-emerald)",
                    },
                  ].map((m) => (
                    <Link
                      key={m.num}
                      href={m.href}
                      style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "16px 20px",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-card)",
                        border: `1px solid ${m.done ? m.color + "40" : "var(--border-subtle)"}`,
                        textDecoration: "none", color: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: "var(--radius-sm)",
                        background: m.done ? m.color + "20" : "var(--bg-input)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.2rem", flexShrink: 0,
                      }}>
                        {m.done ? "✅" : m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>
                          Module {m.num} · {m.label}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{m.desc}</div>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: m.done ? m.color : "var(--text-muted)" }}>
                        {m.done ? "View →" : "Start →"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Matches Preview */}
              {hasData && matchResults && (
                <div className="glass-card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Top Job Matches</h3>
                    <Link href="/job-match" style={{ fontSize: "0.8rem", color: "var(--accent-blue)", textDecoration: "none" }}>
                      Full Results →
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {matchResults.slice(0, 3).map((job, i) => (
                      <div key={job.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{
                          fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem",
                          color: "var(--border-subtle)", width: 20, flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: "1.3rem" }}>{job.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{job.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{job.department}</div>
                        </div>
                        <div style={{
                          fontFamily: "Outfit", fontWeight: 800, fontSize: "1rem",
                          background: "var(--gradient-hero)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                          {job.matchScore}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Activity + Quick Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Quick Actions */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {quickActions.map((a) => (
                    <Link
                      key={a.label}
                      href={a.href}
                      className="btn btn-secondary"
                      style={{ justifyContent: "flex-start", gap: 12 }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16 }}>
                  Recent Activity
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {activityFeed.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: a.color + "20", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "0.9rem", flexShrink: 0,
                      }}>
                        {a.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                          {a.text}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>
                          {a.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
