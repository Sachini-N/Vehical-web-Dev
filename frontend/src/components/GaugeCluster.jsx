import React from 'react';

export default function GaugeCluster({ sensors }) {
  // RPM Needle Angle (-120deg to +120deg for 0 - 7000 RPM)
  const rpmDegrees = -120 + Math.min(7000, sensors.rpm) * (240 / 7000);
  // Coolant Temp Needle (-110deg to +110deg for -20 to 120 C)
  const ectDegrees =
    -110 + (Math.min(120, Math.max(-20, sensors.ect)) + 20) * (220 / 140);

  return (
    <div className="space-y-3.5">
      {/* Main Tachometer (RPM Dial) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center shadow-sm relative overflow-hidden">
        <div className="w-56 h-56 relative flex items-center justify-center">
          <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 200 200">
            {/* Outer Arc */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="5"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Redline Zone (6000 - 7000 RPM) */}
            <path
              d="M 172 135 A 85 85 0 0 0 178 85"
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Scale Ticks (High Contrast Dark Slate) */}
            <text x="35" y="145" fill="#334155" fontSize="11" fontWeight="bold">
              0
            </text>
            <text x="23" y="105" fill="#334155" fontSize="11" fontWeight="bold">
              1000
            </text>
            <text x="38" y="65" fill="#334155" fontSize="11" fontWeight="bold">
              2000
            </text>
            <text x="73" y="42" fill="#334155" fontSize="11" fontWeight="bold">
              3000
            </text>
            <text x="117" y="42" fill="#334155" fontSize="11" fontWeight="bold">
              4000
            </text>
            <text x="150" y="65" fill="#334155" fontSize="11" fontWeight="bold">
              5000
            </text>
            <text x="160" y="105" fill="#334155" fontSize="11" fontWeight="bold">
              6000
            </text>
            <text x="145" y="145" fill="#dc2626" fontSize="11" fontWeight="bold">
              7000
            </text>

            {/* Needle */}
            <g
              style={{
                transform: `rotate(${rpmDegrees}deg)`,
                transformOrigin: '100px 100px',
                transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* Center Pivot */}
            <circle
              cx="100"
              cy="100"
              r="10"
              fill="#1e293b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute bottom-5 text-center">
            <span className="text-3xl font-mono font-extrabold text-slate-900 tracking-wider">
              {sensors.rpm}
            </span>
            <div className="text-[11px] font-bold uppercase text-blue-600">
              Engine RPM <span className="text-slate-500 lowercase">rpm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Gauges: Coolant Temp + Speedometer */}
      <div className="grid grid-cols-2 gap-3">
        {/* Coolant Temp Dial */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center shadow-sm relative">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <path
                d="M 22 85 A 48 48 0 0 1 20 60"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 100 60 A 48 48 0 0 1 96 85"
                fill="none"
                stroke="#ef4444"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <text x="24" y="94" fill="#2563eb" fontSize="8" fontWeight="bold">
                -20
              </text>
              <text x="26" y="55" fill="#334155" fontSize="8" fontWeight="bold">
                20
              </text>
              <text x="44" y="32" fill="#334155" fontSize="8" fontWeight="bold">
                40
              </text>
              <text x="68" y="32" fill="#334155" fontSize="8" fontWeight="bold">
                60
              </text>
              <text x="85" y="55" fill="#334155" fontSize="8" fontWeight="bold">
                80
              </text>
              <text x="88" y="94" fill="#dc2626" fontSize="8" fontWeight="bold">
                120
              </text>

              <g
                style={{
                  transform: `rotate(${ectDegrees}deg)`,
                  transformOrigin: '60px 60px',
                  transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <line
                  x1="60"
                  y1="60"
                  x2="60"
                  y2="22"
                  stroke="#dc2626"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="60" cy="60" r="6" fill="#1e293b" />
            </svg>
            <div className="absolute bottom-2 text-center">
              <span className="text-base font-mono font-extrabold text-slate-900">
                {sensors.ect} °C
              </span>
              <div className="text-[9px] font-bold text-slate-500 uppercase">
                Coolant Temp
              </div>
            </div>
          </div>
        </div>

        {/* Speedometer Digital Readout */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-sm">
          <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            Vehicle Speed
          </span>
          <span className="text-4xl font-mono font-extrabold text-slate-900 my-1">
            {sensors.speed}
          </span>
          <span className="text-xs text-blue-600 font-extrabold">km/h</span>
          <div className="mt-2 text-[10px] text-slate-400 font-mono font-semibold">
            Mode 01 PID 0D
          </div>
        </div>
      </div>
    </div>
  );
}
