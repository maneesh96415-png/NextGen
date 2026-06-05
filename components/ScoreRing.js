"use client";
import { useEffect, useRef } from "react";

export default function ScoreRing({
  score = 75,
  size = 140,
  strokeWidth = 10,
  color = "#4f8ef7",
  label = "Match Score",
  animate = true,
}) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    circleRef.current.style.strokeDashoffset = circumference;
    const timer = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        circleRef.current.style.strokeDashoffset = offset;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [score, animate, circumference, offset]);

  const scoreColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#4f8ef7" : score >= 40 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="score-ring-container">
      <div className="score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id={`ring-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#ring-grad-${score})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animate ? circumference : offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="score-ring-text">
          <span className="score-ring-number" style={{ color: scoreColor }}>
            {score}
          </span>
          <span className="score-ring-label">/ 100</span>
        </div>
      </div>
      {label && (
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {label}
        </span>
      )}
    </div>
  );
}
