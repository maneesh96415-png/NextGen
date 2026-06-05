"use client";
import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import Link from "next/link";
import { SAMPLE_RESUME_TEXT, SAMPLE_JD } from "@/lib/mockData";
import { analyzeResume, STRONG_ACTION_VERBS } from "@/lib/resumeEngine";

// ── Loading steps ─────────────────────────────────────────
const LOADING_STEPS = [
  { msg: "📄 Parsing resume structure & sections...", dur: 700 },
  { msg: "🔍 Generating Sentence-BERT embeddings...", dur: 900 },
  { msg: "📊 Computing TF-IDF keyword scores...", dur: 600 },
  { msg: "🧠 Running ATS compatibility checks...", dur: 700 },
  { msg: "⚡ Detecting weak bullet points...", dur: 500 },
  { msg: "✨ LLM rewriting bullets (STAR method)...", dur: 1000 },
  { msg: "📈 Generating optimization report...", dur: 400 },
];

// ── Priority styles ───────────────────────────────────────
const PRI = {
  critical: { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
  high: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  medium: { color: "#4f8ef7", bg: "rgba(79,142,247,0.1)", border: "rgba(79,142,247,0.2)" },
};

// ── Helper: score color ───────────────────────────────────
const scoreColor = (s) =>
  s >= 75 ? "#10b981" : s >= 55 ? "#4f8ef7" : s >= 38 ? "#f59e0b" : "#f43f5e";
const scoreLabel = (s) =>
  s >= 75 ? "Strong Match" : s >= 55 ? "Good Fit" : s >= 38 ? "Partial Match" : "Weak Match";

// ── Sub-components ────────────────────────────────────────

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        fontFamily: "Inter",
        fontSize: "0.85rem",
        fontWeight: 600,
        transition: "all 0.2s",
        background: active ? "rgba(79,142,247,0.15)" : "transparent",
        color: active ? "var(--accent-blue)" : "var(--text-muted)",
        borderBottom: active ? "2px solid var(--accent-blue)" : "2px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function SectionScore({ data }) {
  const pct = Math.round(data.score);
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: "1.4rem" }}>{data.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 2 }}>{data.section}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{data.feedback}</div>
        </div>
        <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.3rem", color: scoreColor(pct) }}>
          {pct}
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${data.color}, ${data.color}99)` }}
        />
      </div>
    </div>
  );
}

function ATSCheckItem({ check }) {
  const impactColors = { critical: "#f43f5e", high: "#f59e0b", medium: "#4f8ef7" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
      borderRadius: "var(--radius-sm)",
      background: check.pass ? "rgba(16,185,129,0.05)" : "rgba(244,63,94,0.05)",
      border: `1px solid ${check.pass ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`,
    }}>
      <span style={{ fontSize: "1rem", flexShrink: 0 }}>{check.pass ? "✅" : "❌"}</span>
      <span style={{ fontSize: "0.83rem", flex: 1, color: "var(--text-secondary)" }}>{check.label}</span>
      <span style={{
        fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
        padding: "2px 7px", borderRadius: "100px",
        background: impactColors[check.impact] + "20",
        color: impactColors[check.impact],
      }}>
        {check.impact}
      </span>
    </div>
  );
}

function BulletCard({ b, index, kw }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText("• " + b.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="glass-card" style={{ padding: 22, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
          Bullet #{index + 1}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {b.issues.map((iss) => (
            <span key={iss} style={{
              fontSize: "0.65rem", padding: "2px 7px", borderRadius: "100px",
              background: "rgba(244,63,94,0.1)", color: "#f43f5e",
              border: "1px solid rgba(244,63,94,0.2)",
            }}>
              {iss}
            </span>
          ))}
        </div>
      </div>

      {/* Before */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-sm)", marginBottom: 10,
        background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)",
      }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#f43f5e", marginBottom: 4, textTransform: "uppercase" }}>
          ✗ Original
        </div>
        <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          • {b.original}
        </p>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", fontSize: "1.2rem", margin: "8px 0", color: "var(--accent-blue)" }}>↓</div>

      {/* After */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-sm)",
        background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
            ✓ AI Optimized (STAR Method)
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "100px",
              background: "rgba(16,185,129,0.15)", color: "#10b981",
            }}>
              {b.improvement}
            </span>
            <button
              onClick={copy}
              style={{
                background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.25)",
                color: "var(--accent-blue)", borderRadius: "6px", padding: "3px 10px",
                cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, fontFamily: "Inter",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <p style={{ fontSize: "0.84rem", color: "var(--text-primary)", lineHeight: 1.65 }}>
          • {b.optimized}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ResumePage() {
  const [step, setStep] = useState("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedAll, setCopiedAll] = useState(false);
  const fileInputRef = useRef(null);

  const loadSample = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    setJobDesc(SAMPLE_JD);
    setFileName("sample_resume.pdf (demo)");
  };

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result || "");
    reader.readAsText(file);
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) return;
    setLoading(true);
    setLoadingStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      setLoadingMsg(LOADING_STEPS[i].msg);
      await new Promise((r) => setTimeout(r, LOADING_STEPS[i].dur));
    }

    const result = analyzeResume(resumeText, jobDesc);
    setAnalysis(result);
    setLoading(false);
    setStep("results");
    setActiveTab("overview");
  };

  const copyAllOptimized = () => {
    if (!analysis) return;
    const text = analysis.optimizedBullets.map((b) => "• " + b.optimized).join("\n");
    navigator.clipboard?.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };



  const renderResumeWithDiffs = () => {
    if (!analysis) return null;
    const originalLines = resumeText.split("\n");
    const diffMap = {};
    if (analysis.inlineDiffs) {
      analysis.inlineDiffs.forEach((d) => {
        diffMap[d.lineIndex] = d;
      });
    }

    const elements = [];
    
    for (let i = 0; i < originalLines.length; i++) {
      const diff = diffMap[i];
      
      if (diff) {
        if (diff.type === "summary_add") {
          elements.push(
            <div key={`diff-summary-add-${i}`} style={{
              margin: "12px 0", padding: "14px", borderRadius: "var(--radius-sm)",
              background: "rgba(16,185,129,0.08)", border: "1px dashed rgba(16,185,129,0.3)",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
                  ➕ AI Suggested Section (Injected Summary)
                </span>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: "100px",
                  background: "rgba(16,185,129,0.15)", color: "#10b981",
                }}>
                  {diff.improvement}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>
                <strong>Reason:</strong> {diff.reason}
              </div>
              <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-primary)", whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "4px" }}>
                {diff.replacementText}
              </pre>
            </div>
          );
          elements.push(
            <div key={`line-${i}`} style={{ color: "var(--text-secondary)", opacity: 0.85 }}>
              {originalLines[i]}
            </div>
          );
        } else {
          elements.push(
            <div key={`diff-rewrite-${i}`} style={{
              margin: "14px 0", padding: "16px", borderRadius: "var(--radius-sm)",
              background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, 
                  color: diff.type === "keyword_inject" ? "var(--accent-blue)" : "#f59e0b", 
                  textTransform: "uppercase"
                }}>
                  ✏️ Line {i + 1}: {diff.type === "keyword_inject" ? "Keyword Injection" : "Bullet Rewrite"}
                </span>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: "100px",
                  background: "rgba(79,142,247,0.15)", color: "var(--accent-blue)",
                }}>
                  {diff.improvement}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 10 }}>
                <strong>Reason:</strong> {diff.reason}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{
                  padding: "8px 12px", borderRadius: "4px",
                  background: "rgba(244,63,94,0.08)", borderLeft: "4px solid #f43f5e",
                  textDecoration: "line-through", color: "rgba(226,232,240,0.6)",
                }}>
                  {diff.originalLine}
                </div>
                <div style={{
                  padding: "8px 12px", borderRadius: "4px",
                  background: "rgba(16,185,129,0.08)", borderLeft: "4px solid #10b981",
                  color: "var(--text-primary)", fontWeight: 500,
                }}>
                  {diff.replacementLine}
                </div>
              </div>
            </div>
          );
        }
      } else {
        elements.push(
          <div key={`line-${i}`} style={{ color: "var(--text-secondary)", opacity: 0.85 }}>
            {originalLines[i] || " "}
          </div>
        );
      }
    }
    
    return elements;
  };

  const progressPct = loading ? Math.round((loadingStep / LOADING_STEPS.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container">
          {/* ── Page Header ──────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">Module 03 · Sentence-BERT + TF-IDF + ATS Analysis</div>
            <h1 className="section-title">
              Intelligent Resume <span className="gradient-text">Optimizer</span>
            </h1>
            <p className="section-desc">
              Deep analysis engine: ATS compatibility scoring, TF-IDF keyword extraction, section
              quality grading, weak bullet detection, and AI-powered STAR method rewrites.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════
              STEP 1: UPLOAD
          ═══════════════════════════════════════════════ */}
          {step === "upload" && (
            <div className="animate-fade-in-up">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 24 }}>

                {/* Resume Panel */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.2rem" }}>📄</span> Your Resume
                  </div>
                  <div
                    className={`drop-zone ${dragging ? "active" : ""}`}
                    style={{ marginBottom: 12 }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    id="resume-dropzone"
                  >
                    <input
                      ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx"
                      style={{ display: "none" }} onChange={handleFileDrop}
                    />
                    {fileName ? (
                      <>
                        <span className="drop-zone-icon">✅</span>
                        <div className="drop-zone-title">{fileName}</div>
                        <div className="drop-zone-sub">Click to change file</div>
                      </>
                    ) : (
                      <>
                        <span className="drop-zone-icon">📁</span>
                        <div className="drop-zone-title">Drop your resume here</div>
                        <div className="drop-zone-sub">PDF, TXT, DOCX — or click to browse</div>
                      </>
                    )}
                  </div>
                  <textarea
                    className="input-field"
                    id="resume-textarea"
                    placeholder="Or paste your resume text directly here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    style={{ minHeight: 220, fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6 }}
                  />
                  {resumeText && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>
                      {resumeText.split(/\s+/).length} words · {resumeText.split("\n").length} lines
                    </div>
                  )}
                </div>

                {/* JD Panel */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.2rem" }}>💼</span> Target Job Description
                  </div>
                  <textarea
                    className="input-field"
                    id="jd-textarea"
                    placeholder="Paste the full job description. Include required skills, responsibilities, qualifications, and technologies mentioned..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    style={{ minHeight: 360, fontSize: "0.82rem", lineHeight: 1.65 }}
                  />
                  {jobDesc && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>
                      {jobDesc.split(/\s+/).length} words in JD
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Pipeline Preview */}
              <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>
                  7-Step Analysis Pipeline
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                  {LOADING_STEPS.map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", margin: "0 auto 8px",
                        background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem",
                      }}>
                        {s.msg.split(" ")[0]}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                        Step {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Progress */}
              {loading && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{loadingMsg}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 700 }}>{progressPct}%</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: 10, marginBottom: 12 }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#4f8ef7,#7c3aed)", transition: "width 0.5s ease" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {LOADING_STEPS.map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: "100px",
                        background: i <= loadingStep ? "var(--accent-blue)" : "var(--border-subtle)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAnalyze}
                  disabled={loading || !resumeText.trim() || !jobDesc.trim()}
                  id="analyze-resume-btn"
                >
                  {loading
                    ? <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing...</>
                    : "🔍 Analyze & Optimize Resume"}
                </button>
                <button className="btn btn-secondary" onClick={loadSample} id="load-sample-btn">
                  ✨ Load Sample Data
                </button>
                {resumeText && (
                  <button className="btn btn-ghost" onClick={() => { setResumeText(""); setJobDesc(""); setFileName(""); }}>
                    🗑 Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              STEP 2: RESULTS
          ═══════════════════════════════════════════════ */}
          {step === "results" && analysis && (
            <div className="animate-fade-in-up">

              {/* ── Top Score Bar ──────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: 20, marginBottom: 28, alignItems: "center" }}>
                {/* Before */}
                <div className="glass-card" style={{ padding: 28, display: "flex", gap: 20, alignItems: "center" }}>
                  <ScoreRing score={analysis.originalScore} size={110} label="Before" color={scoreColor(analysis.originalScore)} />
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Original Score</div>
                    <div style={{ fontFamily: "Outfit", fontSize: "1.4rem", fontWeight: 800, color: scoreColor(analysis.originalScore), marginBottom: 4 }}>
                      {scoreLabel(analysis.originalScore)}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {analysis.wordCount} words · {analysis.bulletCount} bullets
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#f43f5e", marginTop: 4 }}>
                      ⚠ {analysis.weakBulletCount} weak bullets detected
                    </div>
                  </div>
                </div>

                {/* Delta */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "Outfit", fontSize: "2.2rem", fontWeight: 900,
                    color: "var(--accent-emerald)", lineHeight: 1,
                  }}>
                    +{analysis.optimizedScore - analysis.originalScore}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>points gained</div>
                  <div style={{
                    marginTop: 10, padding: "4px 12px", borderRadius: "100px",
                    background: "rgba(16,185,129,0.12)", color: "#10b981",
                    fontSize: "0.78rem", fontWeight: 700,
                  }}>
                    ↑ {Math.round(((analysis.optimizedScore - analysis.originalScore) / Math.max(analysis.originalScore, 1)) * 100)}%
                  </div>
                </div>

                {/* After */}
                <div className="glass-card" style={{ padding: 28, display: "flex", gap: 20, alignItems: "center", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <ScoreRing score={analysis.optimizedScore} size={110} label="After AI" color={scoreColor(analysis.optimizedScore)} />
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Optimized Score</div>
                    <div style={{ fontFamily: "Outfit", fontSize: "1.4rem", fontWeight: 800, color: scoreColor(analysis.optimizedScore), marginBottom: 4 }}>
                      {scoreLabel(analysis.optimizedScore)}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      After AI rewrites + keywords
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#10b981", marginTop: 4 }}>
                      ✓ {analysis.optimizedBullets.length} bullets enhanced
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Sub-score pills ────────────────────── */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                {[
                  { label: "ATS Score", val: analysis.atsData.atsScore, color: "#4f8ef7" },
                  { label: "Keyword Match", val: analysis.tfidfData.keywordScore, color: "#7c3aed" },
                  { label: "Keywords Matched", val: `${analysis.tfidfData.matched.length}/${analysis.tfidfData.totalJDKeywords}`, color: "#10b981", raw: true },
                  { label: "Missing Keywords", val: analysis.tfidfData.missing.length, color: "#f43f5e", raw: true },
                  { label: "ATS Checks", val: `${analysis.atsData.passed}/${analysis.atsData.total}`, color: "#f59e0b", raw: true },
                ].map((s) => (
                  <div key={s.label} style={{
                    padding: "10px 18px", borderRadius: "var(--radius-md)",
                    background: s.color + "12", border: `1px solid ${s.color}30`,
                    display: "flex", flexDirection: "column", gap: 2, minWidth: 120,
                  }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.4rem", color: s.color, lineHeight: 1 }}>
                      {s.raw ? s.val : `${s.val}`}{!s.raw && "%"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* ── Tabs ──────────────────────────────── */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 0 }}>
                {[
                  { id: "overview", label: "📊 Overview" },
                  { id: "keywords", label: "🔍 Keywords" },
                  { id: "ats", label: "🤖 ATS Checks" },
                  { id: "bullets", label: "✨ AI Rewrites" },
                  { id: "diff", label: "📝 Inline Diff" },
                  { id: "recommendations", label: "💡 Action Plan" },
                ].map((t) => (
                  <TabBtn key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </TabBtn>
                ))}
              </div>

              {/* ─────────────────────── TAB: OVERVIEW ─ */}
              {activeTab === "overview" && (
                <div className="animate-fade-in">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {analysis.sectionScores.map((sec) => (
                      <SectionScore key={sec.section} data={sec} />
                    ))}
                  </div>

                  {/* Quick stats */}
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 16 }}>Resume Statistics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                      {[
                        { label: "Word Count", val: analysis.wordCount, ideal: "250–800", icon: "📝" },
                        { label: "Total Bullets", val: analysis.bulletCount, ideal: "8–15 ideal", icon: "•" },
                        { label: "Weak Bullets", val: analysis.weakBulletCount, ideal: "0 target", icon: "⚠️" },
                        { label: "Keyword Coverage", val: `${analysis.tfidfData.keywordScore}%`, ideal: "70%+ target", icon: "🎯" },
                      ].map((s) => (
                        <div key={s.label} style={{ textAlign: "center", padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-card)" }}>
                          <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{s.icon}</div>
                          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.5rem", color: "var(--accent-blue)" }}>{s.val}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>{s.ideal}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strong action verbs suggestion */}
                  <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12 }}>
                      💪 Recommended Strong Action Verbs
                    </div>
                    <div className="keyword-pills">
                      {STRONG_ACTION_VERBS.slice(0, 24).map((v) => (
                        <span key={v} className="keyword-pill keyword-pill-green">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────── TAB: KEYWORDS ─ */}
              {activeTab === "keywords" && (
                <div className="animate-fade-in">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {/* Matched */}
                    <div className="glass-card" style={{ padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#10b981" }}>
                          ✅ Matched Keywords ({analysis.tfidfData.matched.length})
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {analysis.tfidfData.keywordScore}% coverage
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {analysis.tfidfData.matched.map((k) => (
                          <div key={k.word} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "var(--radius-sm)", background: "rgba(16,185,129,0.06)" }}>
                            <span className="keyword-pill keyword-pill-green" style={{ margin: 0 }}>{k.word}</span>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              JD: {k.jdCount}× · Resume: {k.resumeCount}×
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div className="glass-card" style={{ padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f43f5e" }}>
                          ❌ Missing Keywords ({analysis.tfidfData.missing.length})
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Add to resume
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {analysis.tfidfData.missing.map((k) => (
                          <div key={k.word} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "var(--radius-sm)", background: "rgba(244,63,94,0.05)" }}>
                            <span className="keyword-pill keyword-pill-red" style={{ margin: 0 }}>{k.word}</span>
                            <div style={{ fontSize: "0.7rem", color: "#f43f5e", fontWeight: 600 }}>
                              Appears {k.jdCount}× in JD
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Matched phrases */}
                  {analysis.tfidfData.matchedPhrases.length > 0 && (
                    <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#10b981", marginBottom: 12 }}>
                        ✅ Matched Key Phrases
                      </div>
                      <div className="keyword-pills">
                        {analysis.tfidfData.matchedPhrases.map((p) => (
                          <span key={p} className="keyword-pill keyword-pill-green">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing phrases */}
                  {analysis.tfidfData.missingPhrases.length > 0 && (
                    <div className="glass-card" style={{ padding: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f59e0b", marginBottom: 12 }}>
                        ⚠ Missing Key Phrases — Add to Skills/Experience
                      </div>
                      <div className="keyword-pills">
                        {analysis.tfidfData.missingPhrases.map((p) => (
                          <span key={p} className="keyword-pill keyword-pill-red">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────── TAB: ATS ────── */}
              {activeTab === "ats" && (
                <div className="animate-fade-in">
                  <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                    {/* ATS score ring */}
                    <div className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                      <ScoreRing score={analysis.atsData.atsScore} size={140} label="ATS Score" color={scoreColor(analysis.atsData.atsScore)} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "Outfit", fontSize: "1.2rem", fontWeight: 800, color: scoreColor(analysis.atsData.atsScore) }}>
                          {scoreLabel(analysis.atsData.atsScore)}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                          {analysis.atsData.passed}/{analysis.atsData.total} checks passed
                        </div>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="glass-card" style={{ padding: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 16 }}>
                        ATS Compatibility Checklist
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {analysis.atsData.checks.map((c) => (
                          <ATSCheckItem key={c.label} check={c} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: 20, marginTop: 20, background: "rgba(79,142,247,0.04)", border: "1px solid rgba(79,142,247,0.15)" }}>
                    <div style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                      <strong style={{ color: "var(--accent-blue)" }}>💡 What is ATS?</strong> — Applicant Tracking Systems are used by 99% of Fortune 500 companies to automatically filter resumes before a human reads them. A resume scoring below 60% on ATS checks may be automatically rejected regardless of qualifications. Ensure all critical sections are present and keywords are explicitly listed.
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────── TAB: BULLETS ── */}
              {activeTab === "bullets" && (
                <div className="animate-fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
                        🤖 AI-Generated Bullet Rewrites
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Weak bullets rewritten using the STAR method with JD keyword injection
                      </p>
                    </div>
                    <button
                      className="btn btn-emerald btn-sm"
                      onClick={copyAllOptimized}
                    >
                      {copiedAll ? "✓ Copied All!" : "📋 Copy All Optimized"}
                    </button>
                  </div>

                  {analysis.optimizedBullets.length > 0 ? (
                    analysis.optimizedBullets.map((b, i) => (
                      <BulletCard key={i} b={b} index={i} />
                    ))
                  ) : (
                    <div className="glass-card" style={{ padding: 40, textAlign: "center", background: "rgba(16,185,129,0.04)" }}>
                      <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🏆</span>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>All bullets look strong!</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No weak bullets detected in your resume.</div>
                    </div>
                  )}

                  {/* STAR method guide */}
                  <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 16 }}>📖 STAR Method Guide</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                      {[
                        { letter: "S", word: "Situation", desc: "Set the context and background", color: "#4f8ef7" },
                        { letter: "T", word: "Task", desc: "Describe your responsibility", color: "#7c3aed" },
                        { letter: "A", word: "Action", desc: "Explain what you did (strong verb)", color: "#10b981" },
                        { letter: "R", word: "Result", desc: "Quantify the outcome achieved", color: "#f59e0b" },
                      ].map((s) => (
                        <div key={s.letter} style={{ textAlign: "center", padding: 16, borderRadius: "var(--radius-md)", background: s.color + "10" }}>
                          <div style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: "2rem", color: s.color, lineHeight: 1 }}>{s.letter}</div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", margin: "6px 0", color: s.color }}>{s.word}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────── TAB: INLINE DIFF ── */}
              {activeTab === "diff" && (
                <div className="animate-fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
                        📝 Resume Inline Diff Suggestions
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Surgical line-by-line updates. Review exactly which parts of your resume are changed.
                      </p>
                    </div>

                  </div>

                  <div className="glass-card" style={{ padding: 24, overflowX: "auto" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {renderResumeWithDiffs()}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── TAB: RECOMMENDATIONS */}
              {activeTab === "recommendations" && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>💡 Prioritized Action Plan</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Fix these issues in order to maximize your resume score and recruiter callback rate
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {analysis.recommendations.map((rec, i) => {
                      const style = PRI[rec.priority];
                      return (
                        <div key={i} className="glass-card" style={{ padding: 22, borderColor: style.border, background: style.bg }}>
                          <div style={{ display: "flex", gap: 14 }}>
                            <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{rec.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: style.color }}>{rec.title}</div>
                                <span style={{
                                  fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                                  padding: "2px 8px", borderRadius: "100px",
                                  background: style.bg, color: style.color, border: `1px solid ${style.border}`,
                                }}>
                                  {rec.priority}
                                </span>
                              </div>
                              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>
                                {rec.desc}
                              </p>
                              <div style={{
                                padding: "10px 14px", borderRadius: "var(--radius-sm)",
                                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)",
                                fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.6,
                              }}>
                                <strong style={{ color: style.color }}>→ Action: </strong>{rec.action}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Bottom Actions ─────────────────────── */}
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <button className="btn btn-secondary" onClick={() => { setStep("upload"); setAnalysis(null); }}>
                  ← Analyze Another Resume
                </button>

                <Link href="/skill-gap" className="btn btn-primary">
                  🗺️ View Skill Gap Analysis →
                </Link>
                <Link href="/dashboard" className="btn btn-ghost">
                  📊 Dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
