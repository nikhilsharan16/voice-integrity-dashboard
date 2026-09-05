import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { getAudioPeaks } from "../lib/audio.js";
import { DEMO_PRESETS } from "../data/scenarios.js";

export default function UploadPanel({ onAnalyze, disabled }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [peaks, setPeaks] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [profileKey, setProfileKey] = useState("genuine");
  const [decoding, setDecoding] = useState(false);

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setDecoding(true);
    setAudioUrl(URL.createObjectURL(f));
    try {
      const { peaks } = await getAudioPeaks(f);
      setPeaks(peaks);
    } catch (e) {
      // decoding failed (unsupported format etc.) — still allow analysis,
      // just fall back to no real waveform for this file
      setPeaks(null);
    } finally {
      setDecoding(false);
    }
  };

  return (
    <div>
      <div className="vie-section-label">Analyze a recording</div>
      <div className="vie-section-sub">
        Upload a clip and tag which case it represents — the real model swaps in here once it's wired up.
      </div>

      <div className="vie-dropzone" onClick={() => inputRef.current?.click()}>
        <UploadCloud size={16} style={{ marginBottom: 4 }} />
        <div>{file ? "Choose a different file" : "Click to upload audio"}</div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {file && (
        <>
          <div className="vie-file-name">{file.name}</div>
          {audioUrl && <audio className="vie-audio" controls src={audioUrl} />}
          {decoding && <div className="vie-empty">Decoding audio…</div>}

          <div className="vie-section-label" style={{ marginTop: 8 }}>
            Tag this clip as
          </div>
          <select className="vie-select" value={profileKey} onChange={(e) => setProfileKey(e.target.value)}>
            {DEMO_PRESETS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            className="vie-btn primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={disabled || decoding}
            onClick={() =>
              onAnalyze({
                label: file.name,
                source: "upload",
                profileKey,
                peaks,
              })
            }
          >
            Analyze recording
          </button>
        </>
      )}
    </div>
  );
}
