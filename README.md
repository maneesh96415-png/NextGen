# NextGen CareerNav 🚀

**An AI-Powered Ecosystem for Predictive Job Matching, Skill Gap Analysis, and Intelligent Resume Optimization**

> *PROJECT PROPOSAL & ACADEMIC ABSTRACT — Implemented as a Full-Stack Web Application*

---

## Project Abstract

Traditional career counseling platforms heavily depend on static, rigid, keyword-dependent filtering mechanisms, frequently isolating candidates from actionable insights. **NextGen CareerNav** is an end-to-end intelligent ecosystem architected to dynamically align individual competencies with real-world, fast-evolving workforce demands.

Leveraging comprehensive candidate profiles, skill indices, and target occupational profiles, the framework presents a multi-tiered Artificial Intelligence engine with three interdependent modules.

**Keywords:** *Predictive Analytics, Career Navigation, Semantic Match, Large Language Models (LLMs), Skill Gap Analysis, Multi-Class Classification, Resume Optimization*

---

## Three AI Modules

### Module 01 — Predictive Job Matching 🎯
A supervised Multi-Class Classification model utilizing ensemble structures (XGBoost + Random Forests) to parse complex multidimensional skill matrix data, predicting highly relevant, tailored occupational tracks.

### Module 02 — Skill Gap Analysis & AI Roadmap 🗺️
A Generative AI Orchestration module that compares identified user profiles with market expectations, routing targeted deltas to an LLM to map customized **multi-month skill-acquisition roadmaps**.

### Module 03 — Intelligent Resume Optimizer 📄
An automated Resume Optimization layer that analyzes unstructured PDF text using semantic transformer architectures (Sentence-BERT), deriving structural cosine similarity scores and rewriting bullet points using metric-driven optimization algorithms.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Vanilla CSS — Dark Glassmorphism Theme |
| Charts | Chart.js + react-chartjs-2 (Radar Charts) |
| ML Scoring | Cosine Similarity + Ensemble Skill Matching |
| NLP | Sentence-BERT Semantic Scoring (simulated) |
| LLM Roadmap | Generative AI Orchestration (simulated) |
| Animations | Framer Motion + CSS Keyframes |
| Persistence | localStorage / IndexedDB |

---

## Project Structure

```
careernav/
├── app/
│   ├── globals.css          ← Full design system (dark glassmorphism)
│   ├── layout.js            ← Root layout + Google Fonts (Outfit + Inter)
│   ├── page.js              ← Landing / Hero page
│   ├── dashboard/page.js    ← Career Intelligence Dashboard
│   ├── job-match/page.js    ← Module 1: Predictive Job Matching
│   ├── skill-gap/page.js    ← Module 2: Skill Gap + AI Roadmap
│   └── resume/page.js       ← Module 3: Resume Optimizer
├── components/
│   ├── Navbar.js            ← Glassmorphism navigation bar
│   ├── ScoreRing.js         ← Animated SVG score ring
│   └── SkillRadarChart.js   ← Radar chart for skill visualization
├── lib/
│   ├── mockData.js          ← 10 occupational profiles, 20 skill dimensions
│   └── utils.js             ← Cosine similarity, gap analysis, roadmap generation
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Hero landing — value props, 3 module cards, stats |
| `/dashboard` | Career hub — stats, module progress, activity feed |
| `/job-match` | Skill assessment form → AI job matching → radar chart |
| `/skill-gap` | Gap visualization → 6-month AI learning roadmap |
| `/resume` | PDF upload → similarity score → AI bullet rewrites |

---

## Design System

- **Theme**: Deep Space Navy (`#08091a`) + Glassmorphism
- **Accents**: Electric Blue `#4f8ef7` · Violet `#7c3aed` · Emerald `#10b981`
- **Typography**: Outfit (headings) + Inter (body) — Google Fonts
- **Effects**: Shimmer gradient text, floating orbs, hover glows, animated score rings

---

*NextGen CareerNav democratizes strategic career development, offering highly scalable, precise, and transparent pathways for sustainable professional development.*
