import React from 'react';

export default function SensorGrid({ sensors }) {
  const sensorItems = [
    { name: 'Engine RPM', icon: '⏱️', val: sensors.rpm, unit: 'rpm', range: '0 - 8000', pid: '010C' },
    { name: 'Vehicle Speed', icon: '🚗', val: sensors.speed, unit: 'km/h', range: '0 - 250', pid: '010D' },
    { name: 'Coolant Temp (ECT)', icon: '🌡️', val: `${sensors.ect} °C`, unit: '', range: '-40 - 120 °C', pid: '0105' },
    { name: 'Intake Air Temp (IAT)', icon: '💨', val: `${sensors.iat} °C`, unit: '', range: '-40 - 120 °C', pid: '010F' },
    { name: 'Throttle Position (TPS)', icon: '🎛️', val: `${sensors.tps} %`, unit: '', range: '0 - 100 %', pid: '0111' },
    { name: 'Mass Air Flow (MAF)', icon: '🌬️', val: `${sensors.maf} g/s`, unit: '', range: '0 - 100 g/s', pid: '0110' },
    { name: 'Manifold Pressure (MAP)', icon: '🧭', val: `${sensors.map} kPa`, unit: '', range: '10 - 255 kPa', pid: '010B' },
    { name: 'Oxygen Sensor (O2)', icon: '⚡', val: `${sensors.o2} V`, unit: '', range: '0.1 - 0.9 V', pid: '0114' },
  ];

  return (
    <div className="space-y-2.5">
      {sensorItems.map((s, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/90 hover:border-blue-300 p-3.5 rounded-2xl flex items-center justify-between shadow-xs transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
              {s.icon}
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">{s.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">Range: {s.range}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold font-mono text-blue-600">
              {s.val} {s.unit}
            </div>
            <div className="text-[9px] font-mono text-slate-400 font-semibold">PID {s.pid}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
