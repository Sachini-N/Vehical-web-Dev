import React from 'react';

export default function FaultDetailsView({ fault, onBack }) {
  if (!fault) return null;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-200 rounded-lg text-lg text-slate-700 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-extrabold text-slate-900">Fault Details</h2>
      </div>

      {/* Code Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div>
            <h3 className="text-2xl font-extrabold font-mono text-slate-900">
              {fault.dtcCode}
            </h3>
            <p className="text-xs font-bold text-sky-700 uppercase">
              {fault.sensor} SENSOR FAULT
            </p>
          </div>
        </div>
        <span className="bg-rose-50 text-rose-700 border border-rose-300 text-xs font-extrabold px-3 py-1 rounded-full">
          Active
        </span>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5">
        <p className="text-sm font-bold text-sky-950">
          {fault.faultDescription}
        </p>
      </div>

      {/* Description */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">
          Diagnostic Analysis
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          The Engine Control Module (ECM) has detected that the {fault.sensor}{' '}
          sensor output signal is operating outside normal manufacturer specifications.
        </p>
      </div>

      {/* Possible Causes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-extrabold uppercase text-rose-700 tracking-wider mb-2 flex items-center space-x-1">
          <span>⚠️</span>
          <span>Possible Causes</span>
        </h4>
        <div className="space-y-1.5 text-xs text-slate-700 font-medium">
          {fault.possibleCauses.map((c, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider mb-2 flex items-center space-x-1">
          <span>🛠️</span>
          <span>Recommended Repair Actions</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-700 font-medium">
          {fault.recommendedActions.map((a, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Advisory Disclaimer */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-tight">
        <span className="font-bold">Automotive Advisory:</span> These recommendations are matched against our calibrated OBD-II fault database. Please consult a qualified automobile technician before replacing components.
      </div>
    </div>
  );
}
