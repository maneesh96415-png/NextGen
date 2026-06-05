"use client";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SkillRadarChart({ userSkills, profileSkills, labels, profileTitle }) {
  const data = {
    labels: labels || [],
    datasets: [
      {
        label: "Your Skills",
        data: Object.values(userSkills || {}),
        backgroundColor: "rgba(79, 142, 247, 0.18)",
        borderColor: "#4f8ef7",
        borderWidth: 2.5,
        pointBackgroundColor: "#4f8ef7",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(profileSkills
        ? [
            {
              label: profileTitle || "Required",
              data: Object.values(profileSkills),
              backgroundColor: "rgba(124, 58, 237, 0.12)",
              borderColor: "#7c3aed",
              borderWidth: 2,
              borderDash: [5, 4],
              pointBackgroundColor: "#7c3aed",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: "rgba(148, 163, 184, 0.6)",
          font: { size: 10, family: "Inter" },
          backdropColor: "transparent",
        },
        grid: { color: "rgba(255, 255, 255, 0.06)" },
        angleLines: { color: "rgba(255, 255, 255, 0.06)" },
        pointLabels: {
          color: "#94a3b8",
          font: { size: 11, family: "Inter", weight: "500" },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: { size: 12, family: "Inter" },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "rgba(13, 15, 43, 0.95)",
        borderColor: "rgba(79, 142, 247, 0.3)",
        borderWidth: 1,
        padding: 12,
        titleColor: "#f0f4ff",
        bodyColor: "#94a3b8",
        titleFont: { family: "Outfit", weight: "600" },
        bodyFont: { family: "Inter" },
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/5`,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
