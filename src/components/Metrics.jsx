import React from "react";
import { riskBand } from "../lib/scoring.js";

function MetricCard({ label, value }) {
  const band = value === null ? "idle" : riskBand(100 - value);
  const color = value === null ? "var(--text-dim)" : `var(--${band})`;
  return (
    <div className="vie-metric-card">
      <div className="vie-metric-label">{label}</div>
      <div className="vie-metric-value vie-mono" style={{ color }}>
        {value === null ? "—" : `${value}%`}
      </div>
      <div className="vie-gauge-track">
        <div className="vie-gauge-fill" style={{ width: `${value ?? 0}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Metrics({ latest }) {
  return (
    <div className="vie-metrics">
      <MetricCard label="Voice authenticity" value={latest ? 100 - latest.spoof : null} />
      <MetricCard label="Speaker match" value={latest ? latest.match : null} />
      <MetricCard label="Spoof probability" value={latest ? latest.spoof : null} />
    </div>
  );
}
