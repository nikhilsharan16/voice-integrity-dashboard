import React from "react";
import { MAX_WINDOWS, riskBand } from "../lib/scoring.js";

export default function Timeline({ history }) {
  const w = 560, h = 90, pad = 6;
  if (history.length < 2) {
    return <div className="vie-empty">Risk history will plot here once analysis is running.</div>;
  }
  const points = history
    .map((pt, i) => {
      const x = pad + (i / (MAX_WINDOWS - 1)) * (w - pad * 2);
      const y = h - pad - (pt.risk / 100) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const lastBand = riskBand(history[history.length - 1].risk);

  return (
    <svg className="vie-timeline-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <line x1={pad} y1={h - pad - 0.35 * (h - pad * 2)} x2={w - pad} y2={h - pad - 0.35 * (h - pad * 2)} stroke="#232f3a" strokeDasharray="3,3" />
      <line x1={pad} y1={h - pad - 0.65 * (h - pad * 2)} x2={w - pad} y2={h - pad - 0.65 * (h - pad * 2)} stroke="#232f3a" strokeDasharray="3,3" />
      <polyline points={points} fill="none" stroke={`var(--${lastBand})`} strokeWidth="2" />
    </svg>
  );
}
