import React, { useState } from 'react';

export default function BluetoothScanner({
  isConnected,
  connectedDevice,
  onConnect,
  onDisconnect,
  onBack,
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [connectingAddress, setConnectingAddress] = useState(null);
  const [logs, setLogs] = useState([
    'Bluetooth SPP initialized.',
    'Listening on RFCOMM UUID 00001101-0000-1000-8000-00805F9B34FB',
  ]);

  const [discoveredDevices] = useState([
    {
      name: 'OBDII (ELM327 v1.5)',
      address: '00:1D:A5:68:98:8B',
      type: 'OBD2 SPP',
      rssi: -54,
      paired: true,
    },
    {
      name: 'Car Scanner Adapter',
      address: '00:1B:35:12:34:56',
      type: 'OBD2 SPP',
      rssi: -68,
      paired: true,
    },
    {
      name: 'V-LINK OBD2 Bluetooth',
      address: '11:22:33:44:55:66',
      type: 'BLE 5.0',
      rssi: -79,
      paired: false,
    },
    {
      name: 'Konnwei KW902 OBD',
      address: 'A0:9E:1B:44:11:89',
      type: 'OBD2 SPP',
      rssi: -82,
      paired: false,
    },
  ]);

  const runDiscovery = () => {
    setIsScanning(true);
    setLogs((prev) => [
      ...prev,
      '🔍 Scanning 2.4 GHz spectrum for ELM327 adapters...',
    ]);

    setTimeout(() => {
      setIsScanning(false);
      setLogs((prev) => [
        ...prev,
        `✓ Discovery complete. Found ${discoveredDevices.length} ELM327 adapters nearby.`,
      ]);
    }, 1800);
  };

  const handleDeviceConnect = (dev) => {
    setConnectingAddress(dev.address);
    setLogs((prev) => [
      ...prev,
      `Connecting to ${dev.name} [${dev.address}]...`,
      'Sending ATZ (Reset OBD-II)...',
      'Sending ATE0 (Echo Off)...',
      'Sending ATSP0 (Automatic Protocol Detect: ISO 15765-4 CAN)...',
      '✓ Connected to ECU! Mode 01 & Mode 03 ready.',
    ]);

    setTimeout(() => {
      setConnectingAddress(null);
      onConnect(dev);
    }, 1200);
  };

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
        <h2 className="text-lg font-extrabold text-slate-900">Bluetooth Adapters</h2>
      </div>

      {/* Connection State Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl">
            📡
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              {isConnected ? connectedDevice?.name || 'ELM327 Bluetooth' : 'Not Connected'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isConnected ? `Address: ${connectedDevice?.address}` : 'Pair with OBD-II adapter'}
            </p>
          </div>
        </div>

        {isConnected ? (
          <button
            onClick={onDisconnect}
            className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={runDiscovery}
            disabled={isScanning}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </button>
        )}
      </div>

      {/* Discovered Devices */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
          Nearby OBD-II Devices
        </h4>

        {discoveredDevices.map((dev) => {
          const isCurrent = isConnected && connectedDevice?.address === dev.address;
          const isConnecting = connectingAddress === dev.address;

          return (
            <div
              key={dev.address}
              className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all ${
                isCurrent
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔌</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{dev.name}</span>
                    {dev.paired && (
                      <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                        Paired
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
                    {dev.address} • {dev.rssi} dBm
                  </p>
                </div>
              </div>

              {isCurrent ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ✓ Connected
                </span>
              ) : (
                <button
                  onClick={() => handleDeviceConnect(dev)}
                  disabled={isConnecting}
                  className="px-3 py-1 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-xl transition-colors"
                >
                  {isConnecting ? 'Pairing...' : 'Connect'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Command Output */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-3.5 font-mono text-[11px] space-y-1 shadow-sm">
        <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-slate-800 text-[10px] font-bold">
          <span>AT COMMAND BUS CONSOLE</span>
          <span>SPP RFCOMM</span>
        </div>
        <div className="max-h-28 overflow-y-auto custom-scroll space-y-1 pt-1">
          {logs.map((log, i) => (
            <div key={i} className="text-emerald-400 leading-tight">
              &gt; {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
