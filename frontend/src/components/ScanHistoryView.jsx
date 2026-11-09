import React from 'react';

export default function ScanHistoryView({ history, onBack }) {
  return (
    <div className="space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-200 rounded-lg text-lg text-slate-700 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-extrabold text-slate-900">Diagnostic History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-4xl mb-2">📋</p>
          <h4 className="text-sm font-extrabold text-slate-800">No Past Scans Recorded</h4>
          <p className="text-xs text-slate-500 mt-1">Tap 'Start Vehicle Scan' on the home screen to log diagnostics.</p>
        </div>
      ) : (
        history.map((h) => (
          <div
            key={h.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{h.vehicle}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{h.date}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  h.status === 'Fault Detected'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {h.status}
              </span>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <span className="text-xs font-bold text-slate-600">DTC Codes:</span>
              {h.codes.length > 0 ? (
                h.codes.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  None (Normal)
                </span>
              )}
            </div>

            {h.rpm && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold flex space-x-4">
                <span>Engine RPM: <strong className="text-slate-900">{h.rpm}</strong></span>
                <span>Coolant: <strong className="text-slate-900">{h.ect} °C</strong></span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
