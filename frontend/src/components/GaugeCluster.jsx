import React from 'react';

export default function GaugeCluster({ sensors }) {
  // RPM Needle Angle (-120deg to +120deg for 0 - 7000 RPM)
  const rpmDegrees = -120 + Math.min(7000, sensors.rpm) * (240 / 7000);
  // Coolant Temp Needle (-110deg to +110deg for -20 to 120 C)
  const ectDegrees =
    -110 + (Math.min(120, Math.max(-20, sensors.ect)) + 20) * (220 / 140);

  return (
    <div className="space-y-3">
      {/* Main Tachometer (RPM Dial) */}
      <div className="bg-[#0b162c] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-2xl relative overflow-hidden">
        <div className="w-56 h-56 relative flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Outer Blue Arc */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="#0d1b38"
              stroke="#1d4ed8"
              strokeWidth="4"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Redline Zone (6000 - 7000 RPM) */}
            <path
              d="M 172 135 A 85 85 0 0 0 178 85"
              fill="none"
              stroke="#dc2626"
              strokeWidth="12"
            />

            {/* Scale Ticks */}
            <text x="35" y="145" fill="#ffffff" fontSize="10" fontWeight="bold">
              0
            </text>
            <text x="25" y="105" fill="#ffffff" fontSize="10" fontWeight="bold">
              1000
            </text>
            <text x="40" y="65" fill="#ffffff" fontSize="10" fontWeight="bold">
              2000
            </text>
            <text x="75" y="42" fill="#ffffff" fontSize="10" fontWeight="bold">
              3000
            </text>
            <text x="115" y="42" fill="#ffffff" fontSize="10" fontWeight="bold">
              4000
            </text>
            <text x="150" y="65" fill="#ffffff" fontSize="10" fontWeight="bold">
              5000
            </text>
            <text x="160" y="105" fill="#ffffff" fontSize="10" fontWeight="bold">
              6000
            </text>
            <text x="145" y="145" fill="#ef4444" fontSize="10" fontWeight="bold">
              7000
            </text>

            {/* Needle */}
            <g
              style={{
                transform: `rotate(${rpmDegrees}deg)`,
                transformOrigin: '100px 100px',
              }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* Center Pivot */}
            <circle
              cx="100"
              cy="100"
              r="10"
              fill="#64748b"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute bottom-5 text-center">
            <span className="text-2xl font-mono font-bold text-white tracking-wider">
              {sensors.rpm}
            </span>
            <div className="text-[10px] font-bold uppercase text-sky-400">
              Engine RPM <span className="text-slate-400 lowercase">rpm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Gauges: Coolant Temp + Speedometer */}
      <div className="grid grid-cols-2 gap-3">
        {/* Coolant Temp Dial */}
        <div className="bg-[#0b162c] border border-slate-800 rounded-2xl p-3 flex flex-col items-center shadow-lg relative">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="#0d1b38"
                stroke="#1d4ed8"
                strokeWidth="3"
              />
              <path
                d="M 22 85 A 48 48 0 0 1 20 60"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
              />
              <path
                d="M 100 60 A 48 48 0 0 1 96 85"
                fill="none"
                stroke="#ef4444"
                strokeWidth="6"
              />

              <text x="24" y="94" fill="#60a5fa" fontSize="8" fontWeight="bold">
                -20
              </text>
              <text x="28" y="55" fill="#ffffff" fontSize="8" fontWeight="bold">
                20
              </text>
              <text x="44" y="32" fill="#ffffff" fontSize="8" fontWeight="bold">
                40
              </text>
              <text x="68" y="32" fill="#ffffff" fontSize="8" fontWeight="bold">
                60
              </text>
              <text x="85" y="55" fill="#ffffff" fontSize="8" fontWeight="bold">
                80
              </text>
              <text x="88" y="94" fill="#ef4444" fontSize="8" fontWeight="bold">
                120
              </text>

              <g
                style={{
                  transform: `rotate(${ectDegrees}deg)`,
                  transformOrigin: '60px 60px',
                }}
              >
                <line
                  x1="60"
                  y1="60"
                  x2="60"
                  y2="22"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="60" cy="60" r="6" fill="#64748b" />
            </svg>
            <div className="absolute bottom-2 text-center">
              <span className="text-base font-mono font-bold text-white">
                {sensors.ect}
              </span>
              <div className="text-[9px] font-bold text-slate-300">
                Coolant temp. °C
              </div>
            </div>
          </div>
        </div>

        {/* Speedometer Digital Readout */}
        <div className="bg-[#0b162c] border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg">
          <span className="text-xs uppercase font-bold text-slate-400">
            Speed
          </span>
          <span className="text-4xl font-mono font-bold text-white my-2">
            {sensors.speed}
          </span>
          <span className="text-xs text-sky-400 font-semibold">km/h</span>
          <div className="mt-3 text-[10px] text-slate-500 font-mono">
            PID 010D
          </div>
        </div>
      </div>
    </div>
  );
}

