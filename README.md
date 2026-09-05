# Voice Integrity Dashboard

Frontend for the SIH voice cloning detection project. Fully mocked right
now — no ML pipeline required to run or demo it.

## Running it

```
npm install
npm run dev
```

Opens at http://localhost:5173

## How to use it

- **Upload a recording** in the sidebar — this decodes the real audio
  client-side and shows its actual waveform. Since the detection model
  isn't wired in yet, you tag the clip with which case it represents
  (genuine / cloned / mismatch / replay) and the mock scoring engine
  simulates what the dashboard will do once real detection lands.
- **Demo scenarios** are canned buttons with fake audio, for a reliable
  stage demo that doesn't depend on having good test clips on hand.

## Project structure

```
src/
  App.jsx                 — top-level state and layout
  data/scenarios.js        — mock scenario profiles (target scores)
  lib/scoring.js            — ★ swap this for the real API — see below
  lib/audio.js              — decodes uploaded audio into a waveform
  components/
    Sidebar.jsx              — upload panel, demo buttons, registered speakers
    UploadPanel.jsx          — file upload + tagging + decode
    Hero.jsx                 — waveform + risk verdict
    Waveform.jsx             — bar renderer
    Metrics.jsx               — authenticity / match / spoof cards
    Timeline.jsx               — rolling risk chart
    AssessmentPanel.jsx        — reasoning + challenge/re-verification
    SessionLog.jsx              — history table
```

## Integrating the real ML pipeline

Everything downstream of the model only ever touches `{ spoof, match }` —
that shape is produced by `analyzeWindow()` in `src/lib/scoring.js`. That
function is the entire integration point. Replace its body with a real
call, e.g.:

```js
export async function analyzeWindow(audioChunk) {
  const res = await fetch("/analyze-window", {
    method: "POST",
    body: audioChunk,
  });
  const { spoof_score, speaker_similarity } = await res.json();
  return { spoof: spoof_score, match: speaker_similarity };
}
```

No component needs to change. `App.jsx` currently calls
`analyzeWindow(session.profileKey)` on a timer to simulate a stream of
windows — once real audio chunking exists, swap what gets passed in and
how often the loop ticks, but the scoring/rendering pipeline underneath
is already built.
