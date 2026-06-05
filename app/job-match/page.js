"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import Link from "next/link";
import { SKILL_CATEGORIES, ALL_SKILLS } from "@/lib/mockData";
import { matchJobs, getProfileStrength } from "@/lib/utils";

const SkillRadarChart = dynamic(() => import("@/components/SkillRadarChart"), { ssr: false });

const RADAR_SKILLS = [
  "programming", "data_analysis", "machine_learning", "cloud_computing",
  "databases", "business_acumen", "communication", "leadership",
  "problem_solving", "design",
];
const RADAR_LABELS = [
  "Programming", "Data Analysis", "ML/AI", "Cloud",
  "Databases", "Business", "Communication", "Leadership",
  "Problem Solving", "Design",
];

const DEFAULT_SKILLS = ALL_SKILLS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {});

export default function JobMatchPage() {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [step, setStep] = useState("form"); // form | results
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("cn_user_skills");
      if (saved) setSkills(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSlider = useCallback((id, val) => {
    setSkills((prev) => ({ ...prev, [id]: parseInt(val) }));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // Simulate API call
    const results = matchJobs(skills, 5);
    setMatches(results);
    setSelected(results[0]);
    setStep("results");
    try {
      localStorage.setItem("cn_user_skills", JSON.stringify(skills));
      localStorage.setItem("cn_match_results", JSON.stringify(results));
      localStorage.setItem("cn_user_profile", JSON.stringify({ skills, completedAt: new Date().toISOString() }));
    } catch {}
    setLoading(false);
  };

  const avgSkill = Object.values(skills).reduce((a, b) => a + b, 0) / ALL_SKILLS.length;
  const strength = getProfileStrength(avgSkill);
  const radarUserData = Object.fromEntries(RADAR_SKILLS.map((id) => [id, skills[id] || 0]));
  const radarProfileData = selected
    ? Object.fromEntries(RADAR_SKILLS.map((id) => [id, selected.skills[id] || 0]))
    : null;

  const sliderFill = (val) => `${(val / 5) * 100}%`;
  const levelLabel = (v) => ["", "Novice", "Beginner", "Intermediate", "Advanced", "Expert"][v] || "";

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">Module 01 · Multi-Class Classification</div>
            <h1 className="section-title">
              Predictive <span className="gradient-text">Job Matching</span>
            </h1>
            <p className="section-desc">
              Rate your proficiency across 20 skills. Our ensemble model (XGBoost + Random Forest)
              will map you to the most aligned career tracks in real-time.
            </p>
          </div>

          {step === "form" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>
              {/* Skill Form */}
              <div>
                {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => (
                  <div key={catKey} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                    <div className="skill-category-title" style={{ color: cat.color }}>
                      <div className="skill-category-dot" style={{ background: cat.color }} />
                      {cat.label}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
                      {cat.skills.map((skill) => (
                        <div key={skill.id} className="skill-slider-container">
                          <div className="skill-slider-header">
                            <span className="skill-slider-label">{skill.label}</span>
                            <span className="skill-slider-value">
                              {skills[skill.id]}{skills[skill.id] > 0 ? ` · ${levelLabel(skills[skill.id])}` : ""}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="1"
                            value={skills[skill.id]}
                            onChange={(e) => handleSlider(skill.id, e.target.value)}
                            className="skill-slider"
                            style={{ "--fill": sliderFill(skills[skill.id]) }}
                            aria-label={`${skill.label} proficiency`}
                          />
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                            <span>None</span><span>Novice</span><span>Intermediate</span><span>Expert</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleSubmit}
                  disabled={loading || avgSkill === 0}
                  id="run-job-match-btn"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                      Running AI Analysis...
                    </>
                  ) : (
                    <>🎯 Run Job Match Analysis</>
                  )}
                </button>
              </div>

              {/* Live Preview */}
              <div style={{ position: "sticky", top: "calc(var(--nav-height) + 24px)" }}>
                <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20 }}>Live Profile Preview</h3>
                  {mounted && (
                    <SkillRadarChart
                      userSkills={radarUserData}
                      labels={RADAR_LABELS}
                    />
                  )}
                </div>
                <div className="glass-card" style={{ padding: 24 }}>
                  <div style={{ marginBottom: 12, fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Profile Strength
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: strength.width, background: `linear-gradient(90deg, ${strength.color}, ${strength.color}aa)` }}
                        />
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: strength.color, fontSize: "0.85rem" }}>
                      {strength.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Avg: {avgSkill.toFixed(1)}/5.0 across {ALL_SKILLS.length} skills
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "results" && (
            <div className="animate-fade-in-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 4 }}>
                    ✅ Analysis Complete — {matches.length} Best Matches Found
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Ranked by cosine similarity score on your multidimensional skill vector
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setStep("form"); setSelected(null); }}
                  >
                    ← Retake Assessment
                  </button>
                  <Link href="/skill-gap" className="btn btn-primary btn-sm">
                    Analyze Skill Gap →
                  </Link>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
                {/* Job Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {matches.map((job, i) => (
                    <div
                      key={job.id}
                      className={`glass-card job-card ${selected?.id === job.id ? "glass-card-glow-blue" : ""}`}
                      onClick={() => setSelected(job)}
                      style={{ borderColor: selected?.id === job.id ? "var(--border-accent)" : undefined }}
                    >
                      <span className="job-card-rank">#{i + 1}</span>
                      <span className="job-card-icon">{job.icon}</span>
                      <div className="job-card-title">{job.title}</div>
                      <div className="job-card-dept">{job.department}</div>
                      <div className="job-card-match">
                        <span className="job-card-match-pct">{job.matchScore}%</span>
                        <div style={{ flex: 1 }}>
                          <div className="progress-bar-track">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${job.matchScore}%`,
                                background: job.matchScore >= 80
                                  ? "linear-gradient(90deg,#10b981,#059669)"
                                  : job.matchScore >= 60
                                  ? "linear-gradient(90deg,#4f8ef7,#7c3aed)"
                                  : "linear-gradient(90deg,#f59e0b,#f97316)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className="badge badge-blue">{job.avgSalary}</span>
                        <span
                          className="badge"
                          style={{ background: job.demandColor + "20", color: job.demandColor, border: `1px solid ${job.demandColor}40` }}
                        >
                          {job.demand} Demand
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail Panel */}
                {selected && (
                  <div style={{ position: "sticky", top: "calc(var(--nav-height) + 24px)" }}>
                    <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                          <span style={{ fontSize: "2rem" }}>{selected.icon}</span>
                          <h3 style={{ fontFamily: "Outfit", fontSize: "1.3rem", fontWeight: 700, marginTop: 8 }}>
                            {selected.title}
                          </h3>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{selected.department}</div>
                        </div>
                        <ScoreRing score={selected.matchScore} size={100} />
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                        {selected.description}
                      </p>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                          Key Skills Required
                        </div>
                        <div className="keyword-pills">
                          {selected.keySkills.map((s) => (
                            <span key={s} className="keyword-pill keyword-pill-green">{s}</span>
                          ))}
                        </div>
                      </div>
                      {/* Category Breakdown */}
                      {selected.breakdown && (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
                            Category Breakdown
                          </div>
                          {Object.entries(selected.breakdown).map(([cat, data]) => (
                            <div key={cat} style={{ marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
                                <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{cat}</span>
                                <span style={{ color: "var(--text-muted)" }}>
                                  You: {data.userAvg.toFixed(1)} / Required: {data.profileAvg.toFixed(1)}
                                </span>
                              </div>
                              <div className="progress-bar-track">
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: `${(data.userAvg / 5) * 100}%`,
                                    background: "linear-gradient(90deg,#4f8ef7,#7c3aed)",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="glass-card" style={{ padding: 24 }}>
                      {mounted && (
                        <SkillRadarChart
                          userSkills={radarUserData}
                          profileSkills={Object.fromEntries(RADAR_SKILLS.map((id) => [id, selected.skills[id] || 0]))}
                          labels={RADAR_LABELS}
                          profileTitle={selected.title}
                        />
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <Link href="/skill-gap" className="btn btn-primary w-full">
                        🗺️ Analyze My Skill Gap →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
