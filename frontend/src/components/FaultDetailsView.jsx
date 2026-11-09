import React from 'react';

export default function FaultDetailsView({ fault, onBack }) {
  if (!fault) return null;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-bold">Fault Details</h2>
      </div>

      {/* Code Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-2xl font-bold font-mono text-white">
              {fault.dtcCode}
            </h3>
            <p className="text-xs font-semibold text-sky-400 uppercase">
              {fault.sensor} SENSOR
            </p>
          </div>
        </div>
        <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Active
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-200">
        {fault.faultDescription}
      </p>

      {/* Description */}
      <div className="bg-[#101b2d] border border-slate-800 rounded-2xl p-4 shadow">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
          Description
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Engine Control Module (ECM) has detected that the {fault.sensor}{' '}
          sensor signal is outside the expected operating range or performance is
          lower than expected.
        </p>
      </div>

      {/* Possible Causes */}
      <div className="bg-[#101b2d] border border-slate-800 rounded-2xl p-4 shadow">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
          Possible Causes
        </h4>
        <div className="space-y-1.5 text-xs text-slate-300">
          {fault.possibleCauses.map((c, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-[#101b2d] border border-slate-800 rounded-2xl p-4 shadow">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
          Recommended Actions
        </h4>
        <div className="space-y-1.5 text-xs text-slate-300">
          {fault.recommendedActions.map((a, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Advisory Disclaimer */}
      <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-tight">
        <span className="font-bold">Disclaimer:</span> These suggestions are
        generated from our OBD-II database. Consult a certified technician
        before component replacement.
      </div>
    </div>
  );
}

