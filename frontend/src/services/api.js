import { VEHICLES } from '../data/vehicleData';
import { DTC_DATABASE } from '../data/dtcData';

const getApiBaseUrl = () => {
  if (import.meta.env?.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined') {
    // When deployed (Vercel, Netlify) or on Vite dev server (port 3000)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api';
    }
    if (window.location.port === '3000') {
      return '/api';
    }
  }
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

export const fetchVehicles = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/vehicles`);
    const data = await res.json();
    if (data.success && data.data) return data.data;
  } catch (e) {
    console.log('[API] Using local vehicles');
  }
  return VEHICLES;
};

export const matchFaultsAPI = async (brand, model, dtcCodes) => {
  try {
    const res = await fetch(`${API_BASE_URL}/faults/batch-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, model, dtcCodes }),
    });
    const data = await res.json();
    if (data.success) return data;
  } catch (e) {
    console.log('[API] Using local fault matcher');
  }

  const matched = dtcCodes.map((code) => {
    return (
      DTC_DATABASE[code] || {
        dtcCode: code,
        sensor: 'ECU',
        faultDescription: `Diagnostic Trouble Code (${code})`,
        possibleCauses: ['Unrecognized code', 'Consult repair manual'],
        recommendedActions: ['Perform full workshop diagnostic scan'],
        severity: 'Medium',
      }
    );
  });

  return {
    success: true,
    condition: matched.length > 0 ? 'FAULT_DETECTED' : 'NORMAL',
    totalFaults: matched.length,
    matchedFaults: matched,
  };
};

export const saveScanRecord = async (scanData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanData),
    });
    return await res.json();
  } catch (e) {
    return { success: true, localOnly: true };
  }
};

export const fetchScanHistoryAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/scans`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((item) => ({
        id: item._id || item.id || Date.now().toString(),
        date: item.scanDate ? new Date(item.scanDate).toLocaleString() : (item.date || new Date().toLocaleString()),
        vehicle: typeof item.vehicle === 'object'
          ? `${item.vehicle.brand} ${item.vehicle.model} (${item.vehicle.licensePlate || 'N/A'})`
          : (item.vehicle || 'Vehicle'),
        codes: item.detectedDTCs || item.codes || [],
        status: (item.condition === 'NORMAL' || item.status === 'Normal') ? 'Normal' : 'Fault Detected',
        rpm: item.sensorReadings?.rpm || item.rpm || 1400,
        ect: item.sensorReadings?.ect || item.ect || 50,
      }));
    }
  } catch (e) {
    console.log('[API] Using local scan history fallback');
  }
  return null;
};

export const registerUserAPI = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (e) {
    // Local session simulation fallback
    const mockUser = {
      _id: 'user_' + Date.now(),
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      vehicles: [
        {
          _id: 'veh_' + Date.now(),
          brand: payload.vehicleBrand,
          model: payload.vehicleModel,
          licensePlate: payload.licensePlate,
          year: payload.year,
          fuelType: payload.fuelType,
          mileage: payload.mileage,
          isPrimary: true,
        },
      ],
    };
    return {
      success: true,
      message: 'Account and vehicle registered (Offline Mode)!',
      user: mockUser,
    };
  }
};

export const loginUserAPI = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      message: 'Logged in (Offline Mode)',
      user: {
        _id: 'user_offline',
        fullName: 'Registered Driver',
        email: credentials.email,
        phone: '0771234567',
        vehicles: [
          {
            _id: 'veh_off',
            brand: 'SUZUKI',
            model: 'Wagon R',
            licensePlate: 'WP CAC-4589',
            year: 2018,
            fuelType: 'Petrol / Hybrid',
            mileage: 68500,
            isPrimary: true,
          },
        ],
      },
    };
  }
};

export const addVehicleAPI = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      vehicles: [
        {
          _id: 'veh_' + Date.now(),
          ...payload,
        },
      ],
    };
  }
};

