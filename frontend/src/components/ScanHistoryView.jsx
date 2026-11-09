import React from 'react';

export default function ScanHistoryView({ history, onBack }) {
  return (
    <div className="space-y-3">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-bold">Scan History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">No diagnostic scans recorded yet.</p>
        </div>
      ) : (
        history.map((h) => (
          <div
            key={h.id}
            className="bg-[#101b2d] border border-slate-800 rounded-xl p-3.5 space-y-2 shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-white">{h.vehicle}</h4>
                <p className="text-[11px] text-slate-400">{h.date}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  h.status === 'Fault Detected'
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {h.status}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-xs text-slate-400">DTC:</span>
              {h.codes.length > 0 ? (
                h.codes.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-mono font-bold bg-slate-800 text-rose-400 px-2 py-0.5 rounded"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-semibold">
                  None (Normal)
                </span>
              )}
            </div>

            {h.rpm && (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex space-x-3">
                <span>RPM: {h.rpm}</span>
                <span>ECT: {h.ect} °C</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

