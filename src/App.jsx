import React, { useState, useEffect, useRef, useCallback } from "react";
import { PhoneOff, PlayCircle } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";
import Metrics from "./components/Metrics.jsx";
import Timeline from "./components/Timeline.jsx";
import AssessmentPanel from "./components/AssessmentPanel.jsx";
import SessionLog from "./components/SessionLog.jsx";
import { analyzeWindow, computeRisk, riskBand, reasonsFor, genPhrase, MAX_WINDOWS, TICK_MS } from "./lib/scoring.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState([]);
  const [bars, setBars] = useState(() => Array.from({ length: 36 }, () => 6));
  const [sessionLog, setSessionLog] = useState([]);
  const [registered, setRegistered] = useState([
    { name: "CFO — R. Malhotra", id: "SPK-0142" },
    { name: "CEO — A. Varma", id: "SPK-0087" },
  ]);
  const [challenge, setChallenge] = useState(null);
  
  const timeoutRef = useRef(null);
  const streakRef = useRef(0);

  const latest = history[history.length - 1];
  const risk = latest ? latest.risk : 0;
  const band = latest ? riskBand(risk) : "idle";

  const startAnalysis = (payload) => {
    clearTimeout(timeoutRef.current);
    setSession(payload);
    setHistory([]);
    setTick(0);
    setChallenge(null);
    streakRef.current = 0;
    setRunning(true);
  };

  const endAnalysis = useCallback(
    (auto = false) => {
      clearTimeout(timeoutRef.current);
      setRunning(false);
      setHistory((h) => {
        if (h.length > 0 && session) {
          const last = h[h.length - 1];
          setSessionLog((log) =>
            [
              {
                id: Date.now(),
                label: session.label,
                source: session.source,
                risk: last.risk,
                band: riskBand(last.risk),
                windows: h.length,
                auto,
              },
              ...log,
            ].slice(0, 8)
          );
        }
        return h;
      });
    },
    [session]
  );

  useEffect(() => {
    if (!running || !session) return;

    let active = true; // Prevents race conditions during unmounts/React Strict Mode

    const runTick = () => {
      if (!active) return;

      setTick((t) => {
        const next = t + 1;
        
        // Failsafe: Prevent execution beyond MAX_WINDOWS
        if (next > MAX_WINDOWS) return t;

        const { spoof, match } = analyzeWindow(session.profileKey);
        const risk = computeRisk(spoof, match);
        const band = riskBand(risk);
        streakRef.current = band !== "safe" ? streakRef.current + 1 : 0;

        setHistory((h) => [...h, { t: next, spoof, match, risk, streak: streakRef.current }].slice(-MAX_WINDOWS));

        if (session.peaks && session.peaks.length > 0) {
          const offset = next % session.peaks.length;
          setBars(
            Array.from({ length: 36 }, (_, i) => {
              const p = session.peaks[(offset + i) % session.peaks.length];
              return 4 + p * 80;
            })
          );
        } else {
          setBars(Array.from({ length: 36 }, () => 4 + Math.random() * 40 + (band === "danger" ? Math.random() * 10 : 0)));
        }

        if (next >= MAX_WINDOWS) {
          active = false;
          setTimeout(() => endAnalysis(true), 250);
        } else {
          // Schedule the next tick only after this one completes
          timeoutRef.current = setTimeout(runTick, TICK_MS);
        }

        return next;
      });
    };

    // Kick off the loop
    timeoutRef.current = setTimeout(runTick, TICK_MS);

    return () => {
      active = false;
      clearTimeout(timeoutRef.current);
    };
  }, [running, session, endAnalysis]);

  const triggerChallenge = () => setChallenge({ phrase: genPhrase(), status: "waiting" });
  const resolveChallenge = (pass) => setChallenge((c) => ({ ...c, status: pass ? "pass" : "fail" }));
  const addRegistered = (name) =>
    setRegistered((r) => [...r, { name, id: `SPK-${Math.floor(1000 + Math.random() * 8999)}` }]);

  const reasons = latest ? reasonsFor(latest.spoof, latest.match, latest.risk, latest.streak) : [];

  return (
    <div className="vie-root">
      <Sidebar
        onAnalyze={startAnalysis}
        running={running}
        activeDemoKey={session?.source === "demo" ? session.profileKey : null}
        registered={registered}
        onAddRegistered={addRegistered}
      />

      <main className="vie-main">
        <div className="vie-header">
          <div>
            <div className="vie-title vie-display">Recording analysis</div>
            <div className="vie-subtitle">Continuous near-real-time voice integrity analysis with rolling risk updates</div>
          </div>
          <div className="vie-call-controls">
            {running ? (
              <button className="vie-btn danger-outline" onClick={() => endAnalysis(false)}>
                <PhoneOff size={14} /> Stop analysis
              </button>
            ) : (
              session && (
                <button className="vie-btn primary" onClick={() => startAnalysis(session)}>
                  <PlayCircle size={14} /> Run again
                </button>
              )
            )}
          </div>
        </div>

        <Hero
          running={running}
          activeSession={!!session} 
          hasCompletedSession={!running && history.length > 0} 
          bars={bars}
          sessionLabel={session?.label}
          sourceTag={session?.source === "upload" ? "uploaded" : session?.source === "demo" ? "demo" : null}
          tick={tick}
          band={band}
          risk={risk}
        />

        <Metrics latest={latest} />

        <div className="vie-lower">
          <div className="vie-panel">
            <div className="vie-panel-title">Rolling risk — last {MAX_WINDOWS} windows</div>
            <Timeline history={history} />
          </div>

          <AssessmentPanel
            latest={latest}
            band={band}
            reasons={reasons}
            challenge={challenge}
            onTriggerChallenge={triggerChallenge}
            onResolveChallenge={resolveChallenge}
          />
        </div>

        <SessionLog log={sessionLog} />
      </main>
    </div>
  );
}