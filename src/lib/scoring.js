import { SCENARIOS } from "../data/scenarios.js";

export const MAX_WINDOWS = 16;
export const TICK_MS = 850;

function jitter(target, amount) {
  const v = target + (Math.random() - 0.5) * amount;
  return Math.max(1, Math.min(99, Math.round(v)));
}

export function computeRisk(spoof, match) {
  const mismatchComponent = 100 - match;
  return Math.round(0.58 * spoof + 0.42 * mismatchComponent);
}

export function riskBand(risk) {
  if (risk < 35) return "safe";
  if (risk < 65) return "warn";
  return "danger";
}

export function reasonsFor(spoof, match, risk, streak) {
  const out = [];
  if (spoof > 55) out.push("Synthesis artifacts detected in acoustic signature");
  else if (spoof > 30) out.push("Minor spectral inconsistencies present");
  if (match < 50) out.push("Speaker identity does not match registered profile");
  else if (match < 75) out.push("Partial inconsistency in voice identity match");
  if (streak >= 3 && riskBand(risk) !== "safe") {
    out.push(`Anomaly persistent across ${streak} consecutive windows`);
  }
  if (out.length === 0) out.push("No anomalies detected in current window");
  return out;
}

export function genPhrase() {
  const words = ["MANGO", "GRANITE", "ORBIT", "COBALT", "TRIVET", "HARBOR", "ZEPHYR", "QUARTZ"];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(10 + Math.random() * 89);
  return `${w}-${n}`;
}

/**
 * analyzeWindow — THE SWAP POINT.
 *
 * Right now this generates a fake spoof/match pair by jittering around
 * a scenario's target values, so the whole app can be built and demoed
 * before the real model exists.
 *
 * When the ML pipeline is ready, replace the body of this function with
 * a real call, e.g.:
 *
 *   export async function analyzeWindow(audioChunk) {
 *     const res = await fetch("/analyze-window", {
 *       method: "POST",
 *       body: audioChunk,
 *     });
 *     const { spoof_score, speaker_similarity } = await res.json();
 *     return { spoof: spoof_score, match: speaker_similarity };
 *   }
 *
 * Nothing else in the app needs to change — every component only reads
 * from the { spoof, match, risk } shape this function returns.
 */
export function analyzeWindow(profileKey) {
  const profile = SCENARIOS[profileKey] || SCENARIOS.genuine;
  const spoof = jitter(profile.spoofTarget, 14);
  const match = jitter(profile.matchTarget, 10);
  return { spoof, match };
}
