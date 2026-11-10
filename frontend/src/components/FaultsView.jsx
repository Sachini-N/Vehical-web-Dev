import React from 'react';
import { DTC_DATABASE } from '../data/dtcData';

export default function FaultsView({
  activeDTCs,
  onSelectFault,
  onClearCodes,
  onBack,
}) {
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
        <h2 className="text-lg font-extrabold text-slate-900">Diagnostic Faults</h2>
      </div>

      {/* Main Alert Banner (Soft Pastel / La Pata) */}
      {activeDTCs.length > 0 ? (
        <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-4 flex items-center space-x-3.5 text-rose-950 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-2xl shadow-2xs">
            ⚠️
          </div>
          <div>
            <h3 className="font-bold text-base text-rose-950">Engine Fault Detected</h3>
            <p className="text-xs text-rose-700/80 font-medium">
              {activeDTCs.length} active fault code(s) recorded in ECU
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 flex items-center space-x-3.5 text-emerald-950 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-2xl shadow-2xs">
            ✅
          </div>
          <div>
            <h3 className="font-bold text-base text-emerald-950">Vehicle Status: Normal</h3>
            <p className="text-xs text-emerald-700/80 font-medium">
              No DTC error codes detected in engine ECU
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
          Active Diagnostic Trouble Codes (DTC)
        </h4>
        {activeDTCs.length > 0 && (
          <button
            onClick={onClearCodes}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
          >
            Clear Codes (Mode 04)
          </button>
        )}
      </div>

      {/* Faults Cards List */}
      {activeDTCs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <span className="text-4xl block mb-2">🎉</span>
          <h4 className="text-base font-extrabold text-slate-900">All Systems Clear</h4>
          <p className="text-xs text-slate-500 mt-1">
            Engine sensors are operating within optimal OEM thresholds.
          </p>
        </div>
      ) : (
        activeDTCs.map((code) => {
          const fault = DTC_DATABASE[code] || {
            dtcCode: code,
            sensor: 'ECU',
            faultDescription: `Diagnostic Trouble Code (${code})`,
            possibleCauses: ['Unrecognized code', 'Consult workshop manual'],
            recommendedActions: ['Full electronic diagnostic scan'],
            severity: 'Medium',
          };

          return (
            <div
              key={code}
              onClick={() => onSelectFault(fault)}
              className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span className="font-extrabold text-lg text-slate-900 font-mono">
                    {fault.dtcCode}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase">
                    {fault.sensor}
                  </span>
                </div>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <p className="text-sm text-slate-800 font-bold mt-2">
                {fault.faultDescription}
              </p>

              {/* Possible Causes Preview */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                <span className="font-bold text-rose-700 block mb-1">
                  ⚠️ Possible Causes:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 font-medium">
                  {fault.possibleCauses.slice(0, 3).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="mt-3 pt-2.5 border-t border-emerald-100 bg-emerald-50/70 -mx-4 -mb-4 p-3.5 rounded-b-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                    <span>🛠️</span>
                    <span>Recommended Actions:</span>
                  </span>
                  <span className="text-[11px] text-blue-700 font-bold">Details ›</span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  {fault.recommendedActions[0] || 'Inspect sensor wiring and vacuum connections.'}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
