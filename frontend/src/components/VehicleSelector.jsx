import React, { useState } from 'react';
import { VEHICLES } from '../data/vehicleData';

export default function VehicleSelector({
  selectedVehicle,
  onSelectVehicle,
  onClose,
}) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  const brands = ['ALL', ...new Set(VEHICLES.map((v) => v.brand))];

  let filtered = VEHICLES;
  if (selectedBrand !== 'ALL') {
    filtered = filtered.filter((v) => v.brand === selectedBrand);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold">Select Vehicle Model</h2>
          <p className="text-xs text-slate-400">28 Supported Vehicles (Excel Database)</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white font-bold p-1 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search brand or model (e.g. Wagon R, Prius...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101b2d] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Brand Filter Chips */}
      <div className="flex overflow-x-auto custom-scroll space-x-1.5 pb-1">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBrand === b
                ? 'bg-sky-600 text-white shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Vehicle Models List */}
      <div className="space-y-2 max-h-[620px] overflow-y-auto custom-scroll pr-1">
        {filtered.map((v, i) => {
          const isCurrent =
            selectedVehicle.brand === v.brand &&
            selectedVehicle.model === v.model;

          return (
            <div
              key={i}
              onClick={() => {
                onSelectVehicle(v);
                onClose();
              }}
              className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                  : 'bg-[#101b2d] border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider">
                  {v.brand}
                </span>
                <div className="font-semibold text-sm">{v.model}</div>
              </div>
              <span className="text-slate-400 text-base">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

