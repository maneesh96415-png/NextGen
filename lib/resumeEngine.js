// ============================================================
// NextGen CareerNav — Advanced Resume Analysis Engine
// Simulates Sentence-BERT + LLM pipeline
// ============================================================

// ── Strong action verbs library ────────────────────────────
export const STRONG_ACTION_VERBS = [
  "Architected","Engineered","Optimized","Spearheaded","Orchestrated",
  "Accelerated","Automated","Launched","Delivered","Designed",
  "Developed","Implemented","Led","Managed","Built","Transformed",
  "Reduced","Increased","Improved","Drove","Established","Deployed",
  "Mentored","Collaborated","Streamlined","Integrated","Migrated",
  "Scaled","Achieved","Generated","Saved","Negotiated","Created",
  "Revamped","Pioneered","Resolved","Analyzed","Executed","Coordinated",
];

export const WEAK_ACTION_VERBS = [
  "worked","helped","assisted","did","made","used","was","had",
  "handled","involved","responsible","participated","contributed",
  "supported","tried","attempted","wrote","performed","maintained",
];

// ── Stop words to filter ───────────────────────────────────
const STOP_WORDS = new Set([
  "the","and","for","are","but","not","you","all","any","can","had",
  "her","was","one","our","out","day","get","has","him","his","how",
  "its","may","new","now","old","see","two","way","who","boy","did",
  "she","use","her","many","then","them","these","some","would","make",
  "like","into","time","look","more","write","than","with","this","have",
  "from","they","will","been","what","were","when","your","said","each",
  "which","their","there","about","that","also","over","such","after",
  "work","well","even","back","good","much","before","right","too","any",
  "same","tell","does","just","because","come","could","should","those",
  "through","only","where","most","never","under","while","last",
]);

// ── Normalize text to token array ─────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// ── Extract resume sections ───────────────────────────────
export function extractSections(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections = { summary: [], experience: [], education: [], skills: [], other: [] };

  const sectionPatterns = {
    summary: /^(summary|profile|objective|about|introduction)/i,
    experience: /^(experience|work|employment|career|professional|history|positions?)/i,
    education: /^(education|academic|qualification|degree|university|college)/i,
    skills: /^(skills?|technologies|tech stack|competencies|expertise|tools|languages)/i,
  };

  let currentSection = "other";
  let contactLines = [];
  let isFirstLines = true;

  for (const line of lines) {
    // First few lines are typically contact info
    if (isFirstLines && !Object.values(sectionPatterns).some((p) => p.test(line))) {
      contactLines.push(line);
      if (contactLines.length >= 5) isFirstLines = false;
      continue;
    }
    isFirstLines = false;

    let matched = false;
    for (const [sec, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && line.length < 60) {
        currentSection = sec;
        matched = true;
        break;
      }
    }
    if (!matched) sections[currentSection].push(line);
  }

  return { sections, contactLines };
}

// ── Extract bullet points from text ───────────────────────
export function extractBullets(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[•\-\*➤▸◆→]/.test(l) || /^\d+\./.test(l))
    .map((l) => l.replace(/^[•\-\*➤▸◆→\d\.]\s*/, "").trim())
    .filter((l) => l.length > 15);
}

// ── Detect weak bullets (no metric, no strong verb) ───────
export function detectWeakBullets(bullets) {
  return bullets.map((bullet) => {
    const words = bullet.toLowerCase().split(/\s+/);
    const firstWord = words[0] || "";

    const hasMetric = /\d+/.test(bullet);
    const hasStrongVerb = STRONG_ACTION_VERBS.some(
      (v) => v.toLowerCase() === firstWord
    );
    const hasWeakVerb = WEAK_ACTION_VERBS.some(
      (v) => firstWord.startsWith(v) || bullet.toLowerCase().startsWith(v)
    );

    const issues = [];
    if (!hasMetric) issues.push("No quantified metric");
    if (!hasStrongVerb) issues.push("Weak opening verb");
    if (hasWeakVerb) issues.push(`Replace "${firstWord}"`);
    if (bullet.length < 40) issues.push("Too brief");
    if (bullet.length > 200) issues.push("Too long");

    return {
      text: bullet,
      issues,
      isWeak: issues.length >= 2 || hasWeakVerb || (!hasMetric && !hasStrongVerb),
      hasMetric,
      hasStrongVerb,
    };
  });
}

// ── TF-IDF style keyword scoring ──────────────────────────
export function computeTFIDF(resumeText, jdText) {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  // Count frequencies
  const resumeFreq = {};
  for (const t of resumeTokens) resumeFreq[t] = (resumeFreq[t] || 0) + 1;

  const jdFreq = {};
  for (const t of jdTokens) jdFreq[t] = (jdFreq[t] || 0) + 1;

  // Important JD keywords (appears more than once or is longer word)
  const importantJDKeywords = Object.entries(jdFreq)
    .filter(([word, freq]) => freq > 1 || word.length > 5)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  const matched = [];
  const missing = [];

  for (const kw of importantJDKeywords) {
    if (resumeFreq[kw]) {
      matched.push({ word: kw, jdCount: jdFreq[kw], resumeCount: resumeFreq[kw] });
    } else {
      missing.push({ word: kw, jdCount: jdFreq[kw] });
    }
  }

  // Also find exact phrase matches (bigrams)
  const jdBigrams = [];
  for (let i = 0; i < jdTokens.length - 1; i++) {
    jdBigrams.push(`${jdTokens[i]} ${jdTokens[i + 1]}`);
  }

  const resumeText_lower = resumeText.toLowerCase();
  const matchedPhrases = jdBigrams.filter((bg) => resumeText_lower.includes(bg)).slice(0, 8);
  const missingPhrases = jdBigrams
    .filter((bg) => !resumeText_lower.includes(bg) && bg.split(" ").every((w) => w.length > 4))
    .slice(0, 10);

  const keywordScore = importantJDKeywords.length > 0
    ? Math.round((matched.length / Math.max(importantJDKeywords.length, 1)) * 100)
    : 0;

  return {
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 20),
    matchedPhrases,
    missingPhrases,
    keywordScore: Math.min(95, Math.max(10, keywordScore)),
    totalJDKeywords: importantJDKeywords.length,
  };
}

// ── ATS Compatibility checks ───────────────────────────────
export function checkATSCompatibility(resumeText, sections) {
  const checks = [];
  const text = resumeText.toLowerCase();

  // Section headings present
  const hasSummary = sections.summary.length > 0 || /summary|objective|profile/i.test(resumeText);
  const hasExperience = sections.experience.length > 0 || /experience|employment/i.test(resumeText);
  const hasEducation = sections.education.length > 0 || /education|degree/i.test(resumeText);
  const hasSkills = sections.skills.length > 0 || /skills|technologies/i.test(resumeText);

  checks.push({ label: "Professional Summary / Objective", pass: hasSummary, impact: "high" });
  checks.push({ label: "Work Experience Section", pass: hasExperience, impact: "critical" });
  checks.push({ label: "Education Section", pass: hasEducation, impact: "high" });
  checks.push({ label: "Skills / Technologies Section", pass: hasSkills, impact: "high" });

  // Contact info signals
  const hasEmail = /@/.test(resumeText);
  const hasPhone = /\d{10}|\d{3}[-.\s]\d{3}/.test(resumeText);
  const hasLinkedIn = /linkedin/i.test(resumeText);
  checks.push({ label: "Email Address", pass: hasEmail, impact: "critical" });
  checks.push({ label: "Phone Number", pass: hasPhone, impact: "high" });
  checks.push({ label: "LinkedIn Profile", pass: hasLinkedIn, impact: "medium" });

  // Quantified achievements
  const bulletLines = extractBullets(resumeText);
  const quantifiedCount = bulletLines.filter((b) => /\d+/.test(b)).length;
  const hasQuantified = quantifiedCount >= 2;
  checks.push({
    label: `Quantified Achievements (${quantifiedCount}/${bulletLines.length})`,
    pass: hasQuantified,
    impact: "high",
  });

  // Action verbs
  const hasActionVerbs = STRONG_ACTION_VERBS.some((v) =>
    resumeText.toLowerCase().includes(v.toLowerCase())
  );
  checks.push({ label: "Strong Action Verbs", pass: hasActionVerbs, impact: "medium" });

  // Length check (250–800 words ideal)
  const wordCount = resumeText.split(/\s+/).length;
  const goodLength = wordCount >= 200 && wordCount <= 900;
  checks.push({
    label: `Word Count (${wordCount} words — ideal: 250–800)`,
    pass: goodLength,
    impact: "medium",
  });

  // No tables/graphics indication
  const noSpecialChars = !/[│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌]/g.test(resumeText);
  checks.push({ label: "No Table/Graphic Characters (ATS-safe)", pass: noSpecialChars, impact: "medium" });

  const passed = checks.filter((c) => c.pass).length;
  const atsScore = Math.round((passed / checks.length) * 100);

  return { checks, atsScore, passed, total: checks.length };
}

// ── Section quality scoring ───────────────────────────────
export function scoreSections(sections, resumeText, tfidfData) {
  const allBullets = extractBullets(resumeText);
  const weakAnalysis = detectWeakBullets(allBullets);
  const strongBullets = weakAnalysis.filter((b) => !b.isWeak).length;
  const bulletScore = allBullets.length > 0
    ? Math.round((strongBullets / allBullets.length) * 100)
    : 20;

  return [
    {
      section: "Professional Summary",
      icon: "👤",
      score: sections.summary.length > 0 ? Math.min(90, 55 + sections.summary.join(" ").length / 5) : 20,
      feedback: sections.summary.length > 0
        ? "Summary present. Consider adding target role keywords."
        : "Missing professional summary — critical for ATS.",
      color: "#4f8ef7",
    },
    {
      section: "Work Experience",
      icon: "💼",
      score: Math.min(95, bulletScore + tfidfData.keywordScore / 4),
      feedback: `${strongBullets}/${allBullets.length} bullets are impact-driven with strong verbs and metrics.`,
      color: "#7c3aed",
    },
    {
      section: "Skills & Keywords",
      icon: "⚡",
      score: tfidfData.keywordScore,
      feedback: `${tfidfData.matched.length} of ${tfidfData.totalJDKeywords} JD keywords found. Add ${Math.min(5, tfidfData.missing.length)} more.`,
      color: "#10b981",
    },
    {
      section: "Education",
      icon: "🎓",
      score: sections.education.length > 0 ? 80 : 30,
      feedback: sections.education.length > 0
        ? "Education section present. Include GPA if 3.5+."
        : "Education section not clearly labeled.",
      color: "#f59e0b",
    },
  ];
}

// ── Generate AI-optimized bullet rewrites ─────────────────
export function generateOptimizedBullets(resumeText, jdText, tfidfData) {
  const bullets = extractBullets(resumeText);
  const weakAnalysis = detectWeakBullets(bullets);
  const missingWords = tfidfData.missing.map((m) => m.word);
  const missingPhrases = tfidfData.missingPhrases;

  const weakBullets = weakAnalysis.filter((b) => b.isWeak).slice(0, 6);

  return weakBullets.map((b, i) => {
    const kw1 = missingWords[i * 2] || missingWords[i] || "modern tech stack";
    const kw2 = missingWords[i * 2 + 1] || missingPhrases[i] || "industry best practices";
    
    const bulletLower = b.text.toLowerCase();
    let optimized = "";
    let templateType = "";

    // Context-based routing for high-accuracy rewrites
    if (bulletLower.includes("database") || bulletLower.includes("sql") || bulletLower.includes("query") || bulletLower.includes("data")) {
      optimized = `Optimized database query performance and indexes using ${kw1} and ${kw2}, resulting in a 45% reduction in search response times and saving $12K in annual hardware overhead.`;
      templateType = "Database Optimization";
    } else if (bulletLower.includes("led") || bulletLower.includes("team") || bulletLower.includes("manage") || bulletLower.includes("mentor") || bulletLower.includes("project")) {
      optimized = `Spearheaded a cross-functional team of 6 engineers to develop and launch the ${kw1} platform using ${kw2}, achieving all milestones 2 weeks early with zero disruption to legacy workflows.`;
      templateType = "Team Leadership & Project Management";
    } else if (bulletLower.includes("test") || bulletLower.includes("ci") || bulletLower.includes("cd") || bulletLower.includes("pipeline") || bulletLower.includes("quality")) {
      optimized = `Integrated automated regression suites and custom CI/CD pipelines incorporating ${kw1} and ${kw2}, expanding test coverage to 94% and decreasing post-release defects by 58%.`;
      templateType = "Quality Assurance & CI/CD Pipelines";
    } else if (bulletLower.includes("api") || bulletLower.includes("backend") || bulletLower.includes("server") || bulletLower.includes("service")) {
      optimized = `Architected highly scalable API layers and microservice modules utilizing ${kw1} and ${kw2}, scaling application capacity to handle 100K+ concurrent requests at sub-50ms latency.`;
      templateType = "Backend Services & API Scaling";
    } else if (bulletLower.includes("ui") || bulletLower.includes("frontend") || bulletLower.includes("react") || bulletLower.includes("design") || bulletLower.includes("css") || bulletLower.includes("web")) {
      optimized = `Designed and deployed highly responsive, accessible UI modules using React, Next.js, and ${kw1}, boosting page loads by 35% and improving mobile usability scores in accordance with ${kw2}.`;
      templateType = "Frontend UI Engineering";
    } else {
      const defaults = [
        `Architected and deployed high-performance software modules using ${kw1} and ${kw2}, which improved application processing efficiency by 32% under high load conditions.`,
        `Streamlined deployment workflows and refactored legacy modules utilizing ${kw1} and ${kw2}, resulting in a 25% decrease in developer release cycles.`,
        `Engineered robust system components integrated with ${kw1} and ${kw2}, scaling server utilization efficiency by 40% for over 50K active weekly users.`
      ];
      optimized = defaults[i % defaults.length];
      templateType = "Standard Engineering Template";
    }

    const improvementTypes = [];
    if (!b.hasMetric) improvementTypes.push("added quantified metric");
    if (!b.hasStrongVerb) improvementTypes.push("strong action verb");
    improvementTypes.push("JD keyword injection");

    return {
      original: b.text,
      optimized: optimized,
      issues: b.issues,
      improvement: `+${45 + i * 5}% score boost — ${improvementTypes.join(", ")} (${templateType})`,
      improvementPoints: 45 + i * 5,
    };
  });
}

// ── Compute overall resume score ──────────────────────────
export function computeOverallScore(tfidfData, atsData, sectionScores) {
  const keywordWeight = 0.35;
  const atsWeight = 0.30;
  const sectionWeight = 0.35;

  const sectionAvg = sectionScores.reduce((a, s) => a + s.score, 0) / sectionScores.length;

  const raw = Math.round(
    tfidfData.keywordScore * keywordWeight +
    atsData.atsScore * atsWeight +
    sectionAvg * sectionWeight
  );

  return Math.min(92, Math.max(18, raw));
}

// ── Compute optimized score (after AI rewrite) ─────────────
export function computeOptimizedScore(originalScore, bulletCount, missingKeywordCount) {
  const bulletBonus = Math.max(22, Math.min(30, bulletCount * 5));
  const keywordBonus = Math.max(15, Math.min(25, missingKeywordCount * 2));
  const baseOptimized = originalScore + bulletBonus + keywordBonus;
  return Math.min(98, Math.max(84, baseOptimized));
}

// ── Generate personalized recommendations ─────────────────
export function generateRecommendations(tfidfData, atsData, sectionScores, bullets) {
  const recs = [];

  // ATS failures
  const atsFails = atsData.checks.filter((c) => !c.pass && c.impact !== "medium");
  for (const fail of atsFails.slice(0, 2)) {
    recs.push({
      priority: "critical",
      icon: "🔴",
      title: `Add: ${fail.label}`,
      desc: `Missing ${fail.label.toLowerCase()} significantly reduces ATS parsing success rate.`,
      action: `Include a clearly labeled "${fail.label}" section with relevant content.`,
    });
  }

  // Missing high-frequency keywords
  const topMissing = tfidfData.missing.filter((k) => k.jdCount >= 2).slice(0, 3);
  if (topMissing.length > 0) {
    recs.push({
      priority: "high",
      icon: "🟡",
      title: "Inject High-Frequency Keywords",
      desc: `${topMissing.length} critical keywords appear multiple times in the JD but are absent from your resume.`,
      action: `Naturally incorporate: "${topMissing.map((k) => k.word).join('", "')}" into your experience or skills section.`,
    });
  }

  // Weak bullets
  const weakCount = detectWeakBullets(bullets).filter((b) => b.isWeak).length;
  if (weakCount > 0) {
    recs.push({
      priority: "high",
      icon: "🟡",
      title: `Strengthen ${weakCount} Weak Bullet Points`,
      desc: `${weakCount} bullets lack quantified metrics or strong action verbs — the two most important elements recruiters scan for.`,
      action: "Use the STAR method: Start with a strong verb, describe the action, quantify the result (%, $, time, scale).",
    });
  }

  // Phrases
  if (tfidfData.missingPhrases.length > 2) {
    recs.push({
      priority: "medium",
      icon: "🔵",
      title: "Add Key Skill Phrases",
      desc: "Several multi-word technical phrases from the JD are missing from your resume.",
      action: `Add to skills or experience: "${tfidfData.missingPhrases.slice(0, 3).join('", "')}"`,
    });
  }

  // Summary missing
  const summaryScore = sectionScores.find((s) => s.section === "Professional Summary");
  if (summaryScore && summaryScore.score < 40) {
    recs.push({
      priority: "medium",
      icon: "🔵",
      title: "Write a Targeted Professional Summary",
      desc: "A 3-4 line summary at the top of your resume dramatically improves ATS ranking and recruiter engagement.",
      action: "Include: job title, years of experience, 2-3 key skills matching the JD, and a value statement.",
    });
  }

  return recs;
}

export function analyzeResume(resumeText, jdText) {
  const { sections } = extractSections(resumeText);
  const tfidfData = computeTFIDF(resumeText, jdText);
  const atsData = checkATSCompatibility(resumeText, sections);
  const sectionScores = scoreSections(sections, resumeText, tfidfData);
  const allBullets = extractBullets(resumeText);
  const bulletAnalysis = detectWeakBullets(allBullets);
  const originalScore = computeOverallScore(tfidfData, atsData, sectionScores);
  const optimizedBullets = generateOptimizedBullets(resumeText, jdText, tfidfData);
  const optimizedScore = computeOptimizedScore(
    originalScore,
    optimizedBullets.length,
    tfidfData.missing.length
  );
  const recommendations = generateRecommendations(tfidfData, atsData, sectionScores, allBullets);
  const inlineDiffs = generateInlineDiff(resumeText, jdText, tfidfData, optimizedBullets);
  const correctedResumeText = buildCorrectedResume(resumeText, inlineDiffs);

  return {
    originalScore,
    optimizedScore,
    tfidfData,
    atsData,
    sectionScores,
    bulletAnalysis,
    optimizedBullets,
    recommendations,
    inlineDiffs,
    correctedResumeText,
    wordCount: resumeText.split(/\s+/).length,
    bulletCount: allBullets.length,
    weakBulletCount: bulletAnalysis.filter((b) => b.isWeak).length,
  };
}

// ── Normalize bullet point for exact structural comparison ──
export function normalizeBullet(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// ── Generate inline diff data with line indexes ──
export function generateInlineDiff(resumeText, jdText, tfidfData, optimizedBullets) {
  const originalLines = resumeText.split("\n");
  const diffs = [];

  // 1. Identify and map weak bullets to original lines
  for (let i = 0; i < originalLines.length; i++) {
    const trimmed = originalLines[i].trim();
    const bulletMatch = originalLines[i].match(/^(\s*[•\-\*➤▸◆→]|\s*\d+\.)\s*(.*)$/);
    if (bulletMatch) {
      const prefix = bulletMatch[1] + " ";
      const content = bulletMatch[2].trim();
      const normContent = normalizeBullet(content);

      const opt = optimizedBullets.find(
        (ob) => normalizeBullet(ob.original) === normContent
      );

      if (opt) {
        diffs.push({
          lineIndex: i,
          originalLine: originalLines[i],
          replacementLine: prefix + opt.optimized,
          type: "bullet_rewrite",
          reason: opt.issues.join(", "),
          originalText: content,
          replacementText: opt.optimized,
          improvement: opt.improvement,
        });
      }
    }
  }

  // 2. Keyword injection in the Skills / Technologies section
  let skillsHeaderIndex = -1;
  for (let j = 0; j < originalLines.length; j++) {
    const line = originalLines[j].trim();
    if (/^(skills?|technologies|tech stack|competencies|expertise|tools|languages)/i.test(line) && line.length < 60) {
      skillsHeaderIndex = j;
      break;
    }
  }

  if (skillsHeaderIndex !== -1 && tfidfData.missing && tfidfData.missing.length > 0) {
    const topMissing = tfidfData.missing.slice(0, 5).map((m) => m.word);
    let targetIndex = skillsHeaderIndex;
    let originalLine = originalLines[skillsHeaderIndex];

    if (
      originalLine.trim().toLowerCase().replace(/[^a-z]/g, "") === "skills" ||
      originalLine.trim().toLowerCase().replace(/[^a-z]/g, "") === "technologies"
    ) {
      if (skillsHeaderIndex + 1 < originalLines.length && originalLines[skillsHeaderIndex + 1].trim().length > 0) {
        targetIndex = skillsHeaderIndex + 1;
        originalLine = originalLines[targetIndex];
      }
    }

    const separator = originalLine.includes(":") ? " " : ", ";
    const addedText = topMissing.join(", ");
    const lastChar = originalLine.trim().slice(-1);
    const hasTrailingPunct = [",", ".", ";"].includes(lastChar);
    const baseLine = hasTrailingPunct ? originalLine.trim().slice(0, -1) : originalLine;

    diffs.push({
      lineIndex: targetIndex,
      originalLine: originalLine,
      replacementLine: baseLine + separator + addedText,
      type: "keyword_inject",
      reason: `Missing high-frequency target keywords: ${addedText}`,
      originalText: originalLine,
      replacementText: baseLine + separator + addedText,
      improvement: "Enhances keyword match density for ATS parsing",
    });
  }

  // 3. Propose professional summary insertion if missing
  const hasSummary = originalLines.some(
    (line) => /^(summary|profile|objective|about|introduction)/i.test(line.trim()) && line.trim().length < 60
  );

  if (!hasSummary) {
    let summaryInsertIndex = 0;
    for (let j = 0; j < Math.min(10, originalLines.length); j++) {
      const line = originalLines[j].toLowerCase();
      if (line.includes("@") || line.includes("linkedin.com") || /\d{3}[-.\s]\d{3}/.test(line)) {
        summaryInsertIndex = j + 1;
      }
    }
    if (summaryInsertIndex === 0) {
      let nonEmptyCount = 0;
      for (let j = 0; j < originalLines.length; j++) {
        if (originalLines[j].trim().length > 0) {
          nonEmptyCount++;
          if (nonEmptyCount === 2) {
            summaryInsertIndex = j + 1;
            break;
          }
        }
      }
    }

    const keywordsText = tfidfData.matched.slice(0, 3).map((m) => m.word).join(", ");
    const summaryText = `\nProfessional Summary\n--------------------\nResult-oriented Professional with solid experience in technology alignment and problem solving. Competent in applying industry standards and tools including ${keywordsText || "modern engineering methodologies"}. Strong communicator adept at delivering optimized, scalable, and metric-driven technical projects.\n`;

    diffs.push({
      lineIndex: summaryInsertIndex,
      originalLine: "",
      replacementLine: summaryText,
      type: "summary_add",
      reason: "Missing professional summary section (essential for recruiter scanning and ATS routing)",
      originalText: "",
      replacementText: summaryText,
      improvement: "Injected structured professional summary aligned with target keywords",
    });
  }

  return diffs;
}

// ── Rebuild resume applying diff edits from bottom to top ──
export function buildCorrectedResume(resumeText, diffs) {
  if (!diffs || diffs.length === 0) return resumeText;

  const originalLines = resumeText.split("\n");
  let correctedLines = [...originalLines];

  // Sort diffs by lineIndex in descending order to avoid index shifts
  const sortedDiffs = [...diffs].sort((a, b) => b.lineIndex - a.lineIndex);

  for (const diff of sortedDiffs) {
    if (diff.type === "summary_add") {
      correctedLines.splice(diff.lineIndex, 0, diff.replacementLine);
    } else {
      correctedLines[diff.lineIndex] = diff.replacementLine;
    }
  }

  return correctedLines.join("\n");
}
