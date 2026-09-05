import React from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Mic } from "lucide-react";
import Waveform from "./Waveform.jsx";
import { MAX_WINDOWS } from "../lib/scoring.js";

export default function Hero({ running, bars, sessionLabel, sourceTag, tick, band, risk }) {
  return (
    <div className="vie-hero">
      <div>
        <Waveform bars={bars} active={running} />
        <div className="vie-caller-row">
          <Mic size={14} />
          {running ? sessionLabel : "No recording loaded"}
          {sourceTag && <span className="vie-tag">{sourceTag}</span>}
          {running && (
            <span className="vie-mono" style={{ marginLeft: "auto" }}>
              window {tick}/{MAX_WINDOWS}
            </span>
          )}
        </div>
      </div>
      <div className="vie-verdict">
        <div className="vie-verdict-label">Risk verdict</div>
        <div className={`vie-verdict-status ${band}`}>
          {band === "safe" && <ShieldCheck size={20} />}
          {band === "warn" && <ShieldAlert size={20} />}
          {band === "danger" && <ShieldX size={20} />}
          {band === "idle" && <Mic size={20} />}
          {band === "safe" && "Low risk"}
          {band === "warn" && "Medium risk"}
          {band === "danger" && "High risk"}
          {band === "idle" && "Awaiting recording"}
        </div>
        <div className="vie-risk-number vie-mono" style={{ color: band === "idle" ? "var(--text-dim)" : `var(--${band})` }}>
          {band === "idle" ? "—" : risk}
          <span style={{ fontSize: 15, color: "var(--text-dim)" }}>/100</span>
        </div>
      </div>
    </div>
  );
}
