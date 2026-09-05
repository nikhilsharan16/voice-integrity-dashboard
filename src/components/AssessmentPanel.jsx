import React from "react";

export default function AssessmentPanel({ latest, band, reasons, challenge, onTriggerChallenge, onResolveChallenge }) {
  if (!latest) {
    return (
      <div className="vie-panel">
        <div className="vie-panel-title">Assessment</div>
        <div className="vie-empty">Load a recording or demo scenario to see live assessment.</div>
      </div>
    );
  }

  return (
    <div className="vie-panel">
      <div className="vie-panel-title">Assessment</div>
      <div className={`vie-action-banner ${band}`}>
        {band === "safe" && "No secondary verification needed."}
        {band === "warn" && "Recommend additional verification before proceeding."}
        {band === "danger" && "Pause transaction — escalate to secondary verification."}
      </div>
      <ul className="vie-reason-list">
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      {band === "danger" && !challenge && (
        <button className="vie-btn" onClick={onTriggerChallenge}>
          Trigger challenge
        </button>
      )}

      {challenge && (
        <div>
          <div className="vie-section-label">Verification phrase</div>
          <div className="vie-challenge-phrase vie-mono">{challenge.phrase}</div>
          {challenge.status === "waiting" && (
            <div className="vie-call-controls">
              <button className="vie-btn" onClick={() => onResolveChallenge(true)}>
                Simulate pass
              </button>
              <button className="vie-btn danger-outline" onClick={() => onResolveChallenge(false)}>
                Simulate fail
              </button>
            </div>
          )}
          {challenge.status === "pass" && <div className="vie-action-banner safe">Verified — transaction allowed.</div>}
          {challenge.status === "fail" && <div className="vie-action-banner danger">Verification failed — blocked, incident logged.</div>}
        </div>
      )}
    </div>
  );
}
