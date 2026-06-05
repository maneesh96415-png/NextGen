"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { OCCUPATIONAL_PROFILES } from "@/lib/mockData";
import { computeSkillGaps, generateRoadmap } from "@/lib/utils";

const PRIORITY_STYLES = {
  critical: { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)", label: "Critical" },
  high: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "High" },
  moderate: { color: "#4f8ef7", bg: "rgba(79,142,247,0.1)", border: "rgba(79,142,247,0.25)", label: "Moderate" },
};

export default function SkillGapPage() {
  const [step, setStep] = useState("select"); // select | gaps | roadmap
  const [userSkills, setUserSkills] = useState(null);
  const [matchResults, setMatchResults] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState(0);

  useEffect(() => {
    try {
      const s = localStorage.getItem("cn_user_skills");
      const m = localStorage.getItem("cn_match_results");
      if (s) setUserSkills(JSON.parse(s));
      if (m) setMatchResults(JSON.parse(m));
    } catch {}
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProfile || !userSkills) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    const g = computeSkillGaps(userSkills, selectedProfile);
    const profile = OCCUPATIONAL_PROFILES.find((p) => p.id === selectedProfile);
    const r = generateRoadmap(g, profile?.title || "");
    setGaps(g);
    setRoadmap(r);
    setLoading(false);
    setStep("gaps");
  };

  const handleRoadmap = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("roadmap");
  };

  const monthColors = ["#ef4444", "#f59e0b", "#8b5cf6", "#4f8ef7", "#10b981", "#f43f5e"];

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">Module 02 · Generative AI Orchestration</div>
            <h1 className="section-title">
              Skill Gap Analysis &amp;{" "}
              <span className="gradient-text">AI Roadmap</span>
            </h1>
            <p className="section-desc">
              Identify the exact competency deltas between your current skill profile and your target
              role, then receive a personalized multi-month learning roadmap powered by AI.
            </p>
          </div>

          {/* STEP: Select Target Role */}
          {step === "select" && (
            <div className="animate-fade-in-up">
              {!userSkills && (
                <div
                  className="glass-card"
                  style={{
                    padding: 28, marginBottom: 28, textAlign: "center",
                    background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: 10 }}>⚠️</span>
                  <p style={{ color: "var(--accent-amber)", fontSize: "0.9rem" }}>
                    No skill profile found. For best results,{" "}
                    <Link href="/job-match" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
                      complete the Job Match assessment first
                    </Link>
                    . You can still choose a target role manually below.
                  </p>
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>
                  Select Your Target Role
                </h2>
                {matchResults && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>
                    ⚡ Your top matches from Job Match are highlighted
                  </p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {OCCUPATIONAL_PROFILES.map((profile) => {
                    const isTopMatch = matchResults?.some((m) => m.id === profile.id && m.matchScore >= 70);
                    const matchScore = matchResults?.find((m) => m.id === profile.id)?.matchScore;
                    return (
                      <div
                        key={profile.id}
                        className="glass-card"
                        onClick={() => setSelectedProfile(profile.id)}
                        style={{
                          padding: 20, cursor: "pointer",
                          borderColor: selectedProfile === profile.id
                            ? "var(--accent-blue)"
                            : isTopMatch
                            ? "rgba(79,142,247,0.2)"
                            : undefined,
                          background: selectedProfile === profile.id
                            ? "rgba(79,142,247,0.08)"
                            : undefined,
                          position: "relative",
                        }}
                      >
                        {isTopMatch && (
                          <div style={{
                            position: "absolute", top: 10, right: 10,
                            background: "rgba(79,142,247,0.15)",
                            border: "1px solid rgba(79,142,247,0.3)",
                            color: "var(--accent-blue)",
                            fontSize: "0.65rem", fontWeight: 700,
                            padding: "2px 8px", borderRadius: "100px",
                          }}>
                            ⭐ {matchScore}% match
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: "1.5rem" }}>{profile.icon}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{profile.title}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{profile.department}</div>
                          </div>
                          {selectedProfile === profile.id && (
                            <span style={{ marginLeft: "auto", color: "var(--accent-blue)", fontSize: "1.2rem" }}>✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAnalyze}
                disabled={!selectedProfile || loading}
                id="analyze-gap-btn"
              >
                {loading ? (
                  <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analyzing Gaps...</>
                ) : (
                  "⚡ Analyze My Skill Gap →"
                )}
              </button>
            </div>
          )}

          {/* STEP: Gaps */}
          {step === "gaps" && (
            <div className="animate-fade-in-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 4 }}>
                    {gaps.length > 0
                      ? `${gaps.length} Skill Gaps Identified`
                      : "🎉 No significant skill gaps found!"}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Targeting: <strong style={{ color: "var(--text-primary)" }}>
                      {OCCUPATIONAL_PROFILES.find((p) => p.id === selectedProfile)?.title}
                    </strong>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep("select")}>
                    ← Change Role
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRoadmap}
                    disabled={loading}
                    id="gen-roadmap-btn"
                  >
                    {loading
                      ? <><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Generating...</>
                      : "🗺️ Generate AI Roadmap →"}
                  </button>
                </div>
              </div>

              {/* Summary Pills */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                {["critical", "high", "moderate"].map((p) => {
                  const count = gaps.filter((g) => g.priority === p).length;
                  const style = PRIORITY_STYLES[p];
                  return count > 0 ? (
                    <div key={p} style={{
                      padding: "10px 20px", borderRadius: "var(--radius-md)",
                      background: style.bg, border: `1px solid ${style.border}`,
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: "1.3rem" }}>
                        {p === "critical" ? "🔴" : p === "high" ? "🟡" : "🔵"}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: style.color, fontSize: "1.1rem" }}>{count}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {style.label} Priority Gap{count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Gap Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                {gaps.map((gap) => {
                  const style = PRIORITY_STYLES[gap.priority];
                  return (
                    <div
                      key={gap.skillId}
                      className="glass-card"
                      style={{ padding: 22, borderColor: style.border }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: "0.95rem" }}>{gap.skillLabel}</div>
                          <span style={{
                            fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                            padding: "2px 8px", borderRadius: "100px",
                            background: style.bg, color: style.color, border: `1px solid ${style.border}`,
                          }}>
                            {style.label} Priority
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.5rem", color: style.color, lineHeight: 1 }}>
                            -{gap.gap}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>gap level</div>
                        </div>
                      </div>

                      {/* Level bars */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                          <span>Your level: <strong style={{ color: "var(--text-secondary)" }}>{gap.userLevel}/5</strong></span>
                          <span>Required: <strong style={{ color: style.color }}>{gap.requiredLevel}/5</strong></span>
                        </div>
                        <div style={{ position: "relative", height: 10, background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                          <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0,
                            width: `${(gap.requiredLevel / 5) * 100}%`,
                            background: style.color + "25",
                            borderRadius: "100px",
                          }} />
                          <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0,
                            width: `${(gap.userLevel / 5) * 100}%`,
                            background: `linear-gradient(90deg,#4f8ef7,#7c3aed)`,
                            borderRadius: "100px",
                          }} />
                        </div>
                      </div>

                      {gap.resources.length > 0 && (
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                            Recommended Resources
                          </div>
                          {gap.resources.map((r) => (
                            <div key={r.name} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              fontSize: "0.78rem", padding: "6px 0",
                              borderTop: "1px solid var(--border-subtle)",
                            }}>
                              <span style={{ color: "var(--text-secondary)" }}>📚 {r.name}</span>
                              <span className="badge" style={{
                                background: r.free ? "rgba(16,185,129,0.1)" : "rgba(79,142,247,0.1)",
                                color: r.free ? "var(--accent-emerald)" : "var(--accent-blue)",
                                border: "none", fontSize: "0.65rem",
                              }}>
                                {r.free ? "Free" : "Paid"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {gaps.length === 0 && (
                <div className="glass-card" style={{
                  padding: 48, textAlign: "center",
                  background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)",
                }}>
                  <span style={{ fontSize: "4rem", display: "block", marginBottom: 16 }}>🏆</span>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Excellent Profile Match!</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 400, margin: "0 auto" }}>
                    Your skills already meet or exceed the requirements for this role. You are ready to apply!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP: Roadmap */}
          {step === "roadmap" && (
            <div className="animate-fade-in-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 4 }}>
                    🤖 Your AI-Generated 6-Month Roadmap
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Personalized learning plan to become a{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {OCCUPATIONAL_PROFILES.find((p) => p.id === selectedProfile)?.title}
                    </strong>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep("gaps")}>← View Gaps</button>
                  <Link href="/resume" className="btn btn-primary btn-sm">Optimize Resume →</Link>
                </div>
              </div>

              {/* Roadmap Legend */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 28, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>PHASES:</span>
                {roadmap.map((m) => (
                  <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color }} />
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      M{m.month}: {m.theme}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="roadmap-timeline">
                {roadmap.map((month, i) => (
                  <div key={month.month} className="timeline-item">
                    <div className="timeline-dot-col">
                      <div
                        className="timeline-dot"
                        style={{ background: month.color + "20", borderColor: month.color }}
                      >
                        {month.icon}
                      </div>
                    </div>

                    <div
                      className="glass-card timeline-card"
                      onClick={() => setExpandedMonth(expandedMonth === i ? -1 : i)}
                      style={{ borderColor: expandedMonth === i ? month.color + "50" : undefined }}
                    >
                      <div className="timeline-card-header">
                        <div>
                          <div className="timeline-month-label">{month.label}</div>
                          <div className="timeline-theme" style={{ color: month.color }}>{month.theme}</div>
                          {month.focus.length > 0 && (
                            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                              {month.focus.map((f) => (
                                <span key={f} style={{
                                  fontSize: "0.7rem", padding: "2px 8px", borderRadius: "100px",
                                  background: month.color + "15", color: month.color,
                                  border: `1px solid ${month.color}30`,
                                }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                          {expandedMonth === i ? "▲" : "▼"}
                        </span>
                      </div>

                      {expandedMonth === i && (
                        <div className="animate-fade-in">
                          <div className="timeline-tasks">
                            {month.tasks.map((task, ti) => (
                              <div key={ti} className="timeline-task">
                                <div className="timeline-task-bullet" style={{ background: month.color }} />
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                          <div className="timeline-milestone">
                            <span>🏁</span>
                            <span><strong>Milestone:</strong> {month.milestone}</span>
                          </div>
                          {month.resources.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                                Resources for this phase
                              </div>
                              {month.resources.map((r) => (
                                <div key={r.name} style={{
                                  display: "flex", justifyContent: "space-between",
                                  fontSize: "0.8rem", padding: "6px 0",
                                  borderTop: "1px solid var(--border-subtle)",
                                }}>
                                  <span style={{ color: "var(--text-secondary)" }}>📚 {r.name}</span>
                                  <span style={{
                                    fontSize: "0.7rem", padding: "1px 8px", borderRadius: "100px",
                                    background: r.free ? "rgba(16,185,129,0.1)" : "rgba(79,142,247,0.1)",
                                    color: r.free ? "var(--accent-emerald)" : "var(--accent-blue)",
                                  }}>
                                    {r.type} · {r.free ? "Free" : "Paid"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
