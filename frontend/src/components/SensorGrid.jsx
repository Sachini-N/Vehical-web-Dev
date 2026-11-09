import React from 'react';

export default function SensorGrid({ sensors }) {
  const sensorItems = [
    { name: 'Engine RPM', icon: '⏱️', val: sensors.rpm, unit: 'rpm', range: '(0 - 8000)' },
    { name: 'Vehicle Speed', icon: '🚗', val: sensors.speed, unit: 'km/h', range: '(0 - 250)' },
    { name: 'Coolant Temperature (ECT)', icon: '🌡️', val: `${sensors.ect} °C`, unit: '', range: '(-40 - 120)' },
    { name: 'Intake Air Temperature (IAT)', icon: '🌡️', val: `${sensors.iat} °C`, unit: '', range: '(-40 - 120)' },
    { name: 'Throttle Position (TPS)', icon: '🎛️', val: `${sensors.tps} %`, unit: '', range: '(0 - 100)' },
    { name: 'Mass Air Flow (MAF)', icon: '💨', val: `${sensors.maf} g/s`, unit: '', range: '(0 - 100)' },
    { name: 'Manifold Absolute Pressure (MAP)', icon: '🧭', val: `${sensors.map} kPa`, unit: '', range: '(10 - 255)' },
    { name: 'Oxygen Sensor (O2)', icon: '⚡', val: `${sensors.o2} V`, unit: '', range: '(0.1 - 0.9)' },
  ];

  return (
    <div className="space-y-2">
      {sensorItems.map((s, idx) => (
        <div
          key={idx}
          className="bg-[#101b2d] border border-slate-800 p-3 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-base">
              {s.icon}
            </div>
            <div>
              <div className="font-semibold text-xs text-white">{s.name}</div>
              <div className="text-[10px] text-slate-400">{s.range}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold font-mono text-sky-400">
              {s.val} {s.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

