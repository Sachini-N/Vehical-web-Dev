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
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-bold">Faults</h2>
      </div>

      {/* Main Alert Banner */}
      {activeDTCs.length > 0 ? (
        <div className="bg-[#d92d20] rounded-2xl p-4 flex items-center space-x-3.5 text-white shadow-xl">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="font-bold text-base">Engine Fault Detected</h3>
            <p className="text-xs text-red-100">
              {activeDTCs.length} active fault(s) found
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#099250] rounded-2xl p-4 flex items-center space-x-3.5 text-white shadow-xl">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="font-bold text-base">Vehicle Condition: Normal</h3>
            <p className="text-xs text-emerald-100">
              No Known DTC Faults Detected
            </p>
          </div>
        </div>
      )}

      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
        Diagnostic Trouble Codes (DTC)
      </h4>

      {/* Faults Cards List */}
      {activeDTCs.map((code) => {
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
            className="bg-[#101b2d] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all shadow-md active:scale-[0.99]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-rose-500 text-lg font-bold">!</span>
                <span className="font-bold text-lg text-white font-mono">
                  {fault.dtcCode}
                </span>
              </div>
              <span className="bg-rose-600/30 text-rose-300 border border-rose-500/50 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <p className="text-sm text-slate-200 font-semibold mt-2">
              {fault.faultDescription}
            </p>

            {/* Possible Causes Preview (Matches Slide 8 Screen 3) */}
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-rose-400 block mb-1">
                ⚠️ Possible Causes:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                {fault.possibleCauses.slice(0, 3).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Actions (Directly from Excel Sheet) */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 bg-emerald-950/20 -mx-4 -mb-4 p-3.5 rounded-b-2xl border-t border-emerald-900/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <span>🛠️</span>
                  <span>Recommended Actions (කරන්න ඕන දේවල්):</span>
                </span>
                <span className="text-[10px] text-sky-400 font-bold">Details ›</span>
              </div>
              <ul className="space-y-1 text-xs text-emerald-200/90">
                {fault.recommendedActions.slice(0, 3).map((a, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {/* Clear Codes Button (Matches Slide 8) */}
      {activeDTCs.length > 0 && (
        <button
          onClick={onClearCodes}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl shadow-lg transition-all"
        >
          Clear Fault Codes
        </button>
      )}
    </div>
  );
}

