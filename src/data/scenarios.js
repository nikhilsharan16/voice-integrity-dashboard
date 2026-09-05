// Each profile is what the MOCK scoring engine targets. Once the real
// model is ready, these profiles go away entirely — see lib/scoring.js.
export const SCENARIOS = {
  genuine: {
    label: "Genuine speaker",
    description: "Registered speaker, natural speech",
    spoofTarget: 8,
    matchTarget: 93,
  },
  cloned: {
    label: "AI-cloned voice",
    description: "Synthetic speech mimicking a registered speaker",
    spoofTarget: 88,
    matchTarget: 90,
  },
  mismatch: {
    label: "Speaker mismatch",
    description: "Genuine speech, but not the claimed speaker",
    spoofTarget: 14,
    matchTarget: 22,
  },
  replay: {
    label: "Replay attack",
    description: "Recorded genuine audio played back",
    spoofTarget: 62,
    matchTarget: 85,
  },
};

export const DEMO_PRESETS = [
  { key: "genuine", label: "Genuine speaker" },
  { key: "cloned", label: "AI-cloned CEO" },
  { key: "mismatch", label: "Speaker mismatch" },
  { key: "replay", label: "Replay attack" },
];
