// ============================================================
// NextGen CareerNav — Utility Functions
// ============================================================

import { OCCUPATIONAL_PROFILES, LEARNING_RESOURCES } from "./mockData";

/**
 * Compute cosine similarity between two skill vectors
 */
export function cosineSimilarity(vecA, vecB) {
  const keys = Object.keys(vecA);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Match user skills against all occupational profiles
 * Returns top N matches with percentage scores
 */
export function matchJobs(userSkills, topN = 5) {
  const scored = OCCUPATIONAL_PROFILES.map((profile) => {
    const similarity = cosineSimilarity(userSkills, profile.skills);
    const percentage = Math.round(similarity * 100);

    // Compute per-category breakdown
    const breakdown = computeCategoryBreakdown(userSkills, profile.skills);

    return {
      ...profile,
      matchScore: percentage,
      breakdown,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Normalize so best match = ~95%
  const maxScore = scored[0].matchScore;
  if (maxScore > 0) {
    return scored.slice(0, topN).map((job, i) => ({
      ...job,
      matchScore: Math.min(
        99,
        Math.round((job.matchScore / maxScore) * 95) + Math.max(0, 5 - i * 2)
      ),
    }));
  }
  return scored.slice(0, topN);
}

/**
 * Compute category-level breakdown scores
 */
export function computeCategoryBreakdown(userSkills, profileSkills) {
  const categories = {
    technical: ["programming", "data_analysis", "machine_learning", "cloud_computing", "databases", "web_development", "cybersecurity", "devops"],
    domain: ["business_acumen", "finance", "marketing", "product_management", "research", "design"],
    soft: ["communication", "leadership", "problem_solving", "teamwork", "time_management", "adaptability"],
  };

  const result = {};
  for (const [cat, skillIds] of Object.entries(categories)) {
    let userTotal = 0;
    let profileTotal = 0;
    let count = 0;
    for (const id of skillIds) {
      if (userSkills[id] !== undefined && profileSkills[id] !== undefined) {
        userTotal += userSkills[id];
        profileTotal += profileSkills[id];
        count++;
      }
    }
    const userAvg = count > 0 ? userTotal / count : 0;
    const profileAvg = count > 0 ? profileTotal / count : 0;
    result[cat] = {
      userAvg: parseFloat(userAvg.toFixed(2)),
      profileAvg: parseFloat(profileAvg.toFixed(2)),
      gapPercent: Math.max(0, Math.round(((profileAvg - userAvg) / 5) * 100)),
    };
  }
  return result;
}

/**
 * Compute skill gaps between user skills and a target profile
 * Returns sorted list of gaps (most critical first)
 */
export function computeSkillGaps(userSkills, profileId) {
  const profile = OCCUPATIONAL_PROFILES.find((p) => p.id === profileId);
  if (!profile) return [];

  const gaps = [];

  for (const [skillId, requiredLevel] of Object.entries(profile.skills)) {
    const userLevel = userSkills[skillId] || 0;
    const gap = requiredLevel - userLevel;

    if (gap > 0 && requiredLevel >= 3) {
      const resources = LEARNING_RESOURCES[skillId] || [];
      gaps.push({
        skillId,
        skillLabel: skillId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        userLevel,
        requiredLevel,
        gap,
        priority: gap >= 3 ? "critical" : gap >= 2 ? "high" : "moderate",
        resources: resources.slice(0, 2),
      });
    }
  }

  // Sort: critical first, then by gap size
  gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, moderate: 2 };
    return (priorityOrder[a.priority] - priorityOrder[b.priority]) || (b.gap - a.gap);
  });

  return gaps;
}

/**
 * Generate a 6-month learning roadmap (simulated AI output)
 * Distributes gaps across months by priority
 */
export function generateRoadmap(gaps, profileTitle) {
  if (gaps.length === 0) return [];

  const criticalGaps = gaps.filter((g) => g.priority === "critical");
  const highGaps = gaps.filter((g) => g.priority === "high");
  const moderateGaps = gaps.filter((g) => g.priority === "moderate");

  const months = [
    {
      month: 1,
      label: "Month 1",
      theme: "Foundation Building",
      icon: "🏗️",
      color: "#ef4444",
      focus: criticalGaps.slice(0, 2).map((g) => g.skillLabel),
      tasks: [
        `Assess your current skill baseline and set SMART goals for becoming a ${profileTitle}`,
        criticalGaps[0] ? `Begin intensive study of ${criticalGaps[0].skillLabel} — target Level ${criticalGaps[0].requiredLevel}/5` : "Deep-dive into your primary skill gap",
        criticalGaps[1] ? `Start ${criticalGaps[1].skillLabel} fundamentals via structured course` : "Build project portfolio structure",
        "Join relevant online communities and Discord servers for your target field",
      ],
      milestone: `Reach Level ${Math.min(5, (criticalGaps[0]?.userLevel || 1) + 1)}/5 in your top priority skill`,
      resources: criticalGaps[0]?.resources || [],
    },
    {
      month: 2,
      label: "Month 2",
      theme: "Core Skill Development",
      icon: "⚡",
      color: "#f59e0b",
      focus: criticalGaps.slice(1, 3).map((g) => g.skillLabel),
      tasks: [
        criticalGaps[0] ? `Continue advancing ${criticalGaps[0].skillLabel} — complete intermediate projects` : "Advance primary skill to intermediate",
        criticalGaps[2] ? `Introduce ${criticalGaps[2].skillLabel} with daily 30-min practice sessions` : "Expand your portfolio with real projects",
        highGaps[0] ? `Begin ${highGaps[0].skillLabel} coursework` : "Strengthen soft skills through practice",
        "Complete 2 mini-projects applying new skills to real problems",
      ],
      milestone: "Complete at least one end-to-end project demonstrating critical skills",
      resources: criticalGaps[1]?.resources || [],
    },
    {
      month: 3,
      label: "Month 3",
      theme: "Application & Projects",
      icon: "🚀",
      color: "#8b5cf6",
      focus: highGaps.slice(0, 2).map((g) => g.skillLabel),
      tasks: [
        `Build a portfolio project specifically targeting ${profileTitle} requirements`,
        highGaps[0] ? `Deepen ${highGaps[0].skillLabel} skills through hands-on challenges` : "Deepen high-priority skills",
        highGaps[1] ? `Start ${highGaps[1].skillLabel} fundamentals` : "Expand project complexity",
        "Seek feedback from professionals in your target field via LinkedIn or mentorship platforms",
      ],
      milestone: "Have 1 major portfolio project ready to showcase",
      resources: highGaps[0]?.resources || [],
    },
    {
      month: 4,
      label: "Month 4",
      theme: "Specialization & Depth",
      icon: "🎯",
      color: "#4f8ef7",
      focus: highGaps.slice(1, 3).map((g) => g.skillLabel),
      tasks: [
        `Pursue a relevant certification for ${profileTitle} (if applicable)`,
        highGaps[1] ? `Master ${highGaps[1].skillLabel} to meet job requirements` : "Pursue certification preparation",
        moderateGaps[0] ? `Address ${moderateGaps[0].skillLabel} through targeted practice` : "Refine technical depth",
        "Start applying for internships, freelance gigs, or open source contributions",
      ],
      milestone: "Obtain or be actively preparing for a recognized industry certification",
      resources: highGaps[1]?.resources || [],
    },
    {
      month: 5,
      label: "Month 5",
      theme: "Industry Exposure",
      icon: "🌐",
      color: "#10b981",
      focus: moderateGaps.slice(0, 2).map((g) => g.skillLabel),
      tasks: [
        "Polish and expand your portfolio to 3+ strong projects",
        moderateGaps[0] ? `Refine ${moderateGaps[0].skillLabel} to match industry benchmarks` : "Continue portfolio growth",
        "Attend 2 industry meetups, webinars, or hackathons",
        "Optimize your LinkedIn and resume with keywords from actual job descriptions",
        "Begin networking with 5+ professionals in your target role",
      ],
      milestone: "Active job applications with a polished portfolio and refined resume",
      resources: moderateGaps[0]?.resources || [],
    },
    {
      month: 6,
      label: "Month 6",
      theme: "Job-Ready Sprint",
      icon: "🏆",
      color: "#f43f5e",
      focus: ["Interview Prep", "Networking", "Applications"],
      tasks: [
        "Complete 20+ mock interviews (technical + behavioral) on platforms like Pramp or Interviewing.io",
        "Tailor your resume and cover letter for each application using AI-powered optimization",
        "Maintain a job application tracker with 20+ active applications",
        "Follow up on applications and request informational interviews",
        "Negotiate offers confidently using industry salary benchmarks",
      ],
      milestone: `Land your first interview for a ${profileTitle} role 🎉`,
      resources: [],
    },
  ];

  return months;
}

/**
 * Compute resume-to-JD similarity score
 * Keyword-based matching simulating Sentence-BERT cosine similarity
 */
export function computeResumeSimilarity(resumeText, jobDescription) {
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const resumeWords = new Set(normalize(resumeText));
  const jdWords = normalize(jobDescription);

  if (jdWords.length === 0) return 0;

  let matches = 0;
  const matchedKeywords = [];
  const missingKeywords = [];

  for (const word of jdWords) {
    if (resumeWords.has(word)) {
      matches++;
      if (!matchedKeywords.includes(word)) matchedKeywords.push(word);
    } else {
      if (!missingKeywords.includes(word)) missingKeywords.push(word);
    }
  }

  const rawScore = matches / jdWords.length;
  // Scale to realistic range 30-85 for unoptimized resumes
  const score = Math.min(85, Math.max(28, Math.round(rawScore * 120 + 20)));

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords
      .filter((w) => w.length > 4)
      .slice(0, 20),
  };
}

/**
 * Generate AI-optimized resume bullet points (simulated LLM output)
 */
export function optimizeResumeBullets(resumeText, jobDescription, similarityData) {
  const { missingKeywords } = similarityData;

  // Extract bullet points from resume
  const bullets = resumeText
    .split("\n")
    .filter((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))
    .map((line) => line.replace(/^[•\-]\s*/, "").trim())
    .filter((line) => line.length > 10);

  // Sample weak→strong rewrites
  const rewrites = [
    {
      original: bullets[0] || "Worked on backend systems",
      optimized: `Architected and implemented scalable ${missingKeywords[0] || "microservices"} backend systems, reducing API response latency by 40% and supporting 10K+ concurrent users`,
      improvement: "+68% keyword alignment",
    },
    {
      original: bullets[1] || "Did some optimization work",
      optimized: `Optimized critical ${missingKeywords[1] || "database"} query performance using indexing strategies and query refactoring, achieving 3.2x throughput improvement across production workloads`,
      improvement: "+55% impact quantification",
    },
    {
      original: bullets[2] || "Helped the team with various tasks",
      optimized: `Led cross-functional ${missingKeywords[2] || "agile"} sprint ceremonies for a 6-engineer team, mentored 2 junior developers, and drove 98% on-time feature delivery across 4 quarterly releases`,
      improvement: "+72% leadership visibility",
    },
    {
      original: bullets[3] || "Participated in code reviews",
      optimized: `Conducted systematic code reviews enforcing ${missingKeywords[3] || "REST API"} design standards and security best practices, reducing post-deployment defect rate by 35%`,
      improvement: "+61% specificity",
    },
    {
      original: bullets[4] || "Wrote code for features",
      optimized: `Delivered 12 production features using ${missingKeywords[4] || "Python"} and ${missingKeywords[5] || "Docker"}, following TDD principles with 92% unit test coverage across all modules`,
      improvement: "+80% technical credibility",
    },
  ];

  return rewrites.slice(0, Math.min(bullets.length + 2, 5));
}

/**
 * Get overall profile strength label
 */
export function getProfileStrength(avgScore) {
  if (avgScore >= 4.2) return { label: "Expert", color: "#10b981", width: "95%" };
  if (avgScore >= 3.5) return { label: "Advanced", color: "#4f8ef7", width: "80%" };
  if (avgScore >= 2.5) return { label: "Intermediate", color: "#f59e0b", width: "60%" };
  if (avgScore >= 1.5) return { label: "Beginner", color: "#f97316", width: "35%" };
  return { label: "Novice", color: "#ef4444", width: "15%" };
}

/**
 * Format number with commas
 */
export function formatNumber(n) {
  return n.toLocaleString("en-IN");
}
