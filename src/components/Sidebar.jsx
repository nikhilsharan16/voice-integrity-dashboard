import React, { useState } from "react";
import { RadioTower, UserPlus } from "lucide-react";
import { DEMO_PRESETS } from "../data/scenarios.js";
import UploadPanel from "./UploadPanel.jsx";

export default function Sidebar({ onAnalyze, running, activeDemoKey, registered, onAddRegistered }) {
  const [nameInput, setNameInput] = useState("");

  const addRegistered = () => {
    if (!nameInput.trim()) return;
    onAddRegistered(nameInput.trim());
    setNameInput("");
  };

  return (
    <aside className="vie-sidebar">
      <div className="vie-brand vie-display">
        <div className="vie-brand-mark">
          <RadioTower size={15} />
        </div>
        Voice Integrity
      </div>

      <UploadPanel disabled={running} onAnalyze={(payload) => onAnalyze(payload)} />

      <div>
        <div className="vie-section-label">Demo scenarios</div>
        <div className="vie-section-sub">Canned examples for a reliable stage demo — not real audio.</div>
        {DEMO_PRESETS.map((p) => (
          <button
            key={p.key}
            className={`vie-scenario-btn${activeDemoKey === p.key && running ? " active" : ""}`}
            onClick={() => onAnalyze({ label: p.label, source: "demo", profileKey: p.key, peaks: null })}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <div className="vie-section-label">Registered speakers</div>
        {registered.map((r) => (
          <div className="vie-reg-item" key={r.id}>
            <span>{r.name}</span>
            <span className="vie-mono">{r.id}</span>
          </div>
        ))}
        <input
          className="vie-input"
          style={{ marginTop: 10 }}
          placeholder="Full name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addRegistered()}
        />
        <button className="vie-add-btn" onClick={addRegistered}>
          <UserPlus size={13} /> Register voice sample
        </button>
      </div>
    </aside>
  );
}
