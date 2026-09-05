import React from "react";

export default function SessionLog({ log }) {
  return (
    <div className="vie-panel" style={{ marginTop: 18 }}>
      <div className="vie-panel-title">Session log</div>
      {log.length === 0 ? (
        <div className="vie-empty">Completed analyses will appear here.</div>
      ) : (
        <table className="vie-log-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Source</th>
              <th>Windows</th>
              <th>Final risk</th>
            </tr>
          </thead>
          <tbody>
            {log.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td className="vie-mono">{row.source}</td>
                <td className="vie-mono">{row.windows}</td>
                <td>
                  <span className={`vie-dot ${row.band}`} />
                  {row.risk}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
