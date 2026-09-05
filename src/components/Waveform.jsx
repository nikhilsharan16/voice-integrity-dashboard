import React from "react";

export default function Waveform({ bars, active }) {
  return (
    <div className={`vie-waveform${active ? "" : " idle"}`}>
      {bars.map((h, i) => (
        <div className="vie-bar" key={i} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}
