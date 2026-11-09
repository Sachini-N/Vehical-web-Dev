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
    'System ready. Bluetooth SPP Profile enabled.',
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
      '🔍 Starting Bluetooth inquiry (Discovery mode)...',
      'Scanning 2.4 GHz frequency for OBD-II compatible adapters...',
    ]);

    setTimeout(() => {
      setIsScanning(false);
      setLogs((prev) => [
        ...prev,
        `✓ Discovery complete. Found ${discoveredDevices.length} adapters nearby.`,
      ]);
    }, 1600);
  };

  const handleDeviceClick = (dev) => {
    setConnectingAddress(dev.address);
    setLogs([
      `Pairing with ${dev.name} (${dev.address})...`,
      'Opening RFCOMM socket...',
    ]);

    setTimeout(() => {
      setLogs((prev) => [...prev, '> AT Z (Resetting ELM327)']);
      setTimeout(() => {
        setLogs((prev) => [...prev, '< ELM327 v1.5 OK']);
        setLogs((prev) => [...prev, '> AT E0 (Echo off)']);
        setTimeout(() => {
          setLogs((prev) => [...prev, '< OK']);
          setLogs((prev) => [
            ...prev,
            '> AT SP 0 (Auto Protocol Select: ISO 15765-4 CAN 11/500)',
          ]);
          setTimeout(() => {
            setLogs((prev) => [...prev, '< OK (ECU Responding on 500kbps)']);
            setLogs((prev) => [...prev, '> 0100 (Querying Supported PIDs)']);
            setTimeout(() => {
              setLogs((prev) => [...prev, '< 41 00 BE 3F B8 11']);
              setLogs((prev) => [
                ...prev,
                '✓ Vehicle ECU Communication Established!',
              ]);
              onConnect(dev);
              setConnectingAddress(null);
            }, 300);
          }, 300);
        }, 300);
      }, 300);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
          >
            ←
          </button>
          <h2 className="text-lg font-bold">Bluetooth OBD-II Scanner</h2>
        </div>
        <button
          onClick={runDiscovery}
          disabled={isScanning}
          className="px-3 py-1 bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white rounded-lg shadow disabled:opacity-50 transition-all"
        >
          {isScanning ? 'Scanning...' : 'Scan Devices'}
        </button>
      </div>

      {/* Radar Animation Area */}
      <div className="relative h-44 bg-[#071120] border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-inner">
        <div className="absolute w-36 h-36 border border-sky-500/20 rounded-full"></div>
        <div className="absolute w-24 h-24 border border-sky-500/30 rounded-full"></div>
        <div className="absolute w-12 h-12 border border-sky-500/40 rounded-full"></div>

        {isScanning && (
          <div
            className="absolute w-36 h-36 rounded-full radar-sweep"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(56, 189, 248, 0.4) 0deg, transparent 60deg)',
            }}
          ></div>
        )}

        {isScanning && (
          <div className="absolute w-28 h-28 border-2 border-sky-400 rounded-full sonar-ring"></div>
        )}

        <div className="z-10 w-12 h-12 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20">
          📡
        </div>

        <p className="z-10 text-xs font-semibold text-sky-300 mt-3">
          {isScanning
            ? 'Inquiring nearby ELM327 Bluetooth adapters...'
            : 'Bluetooth Radio Active • Ready to Pair'}
        </p>
      </div>

      {/* Devices List */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Nearby OBD-II Adapters
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">SPP UUID 00001101</span>
        </div>

        <div className="space-y-2">
          {discoveredDevices.map((dev) => {
            const isThisConnected =
              isConnected && connectedDevice?.address === dev.address;
            const isThisConnecting = connectingAddress === dev.address;

            return (
              <div
                key={dev.address}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isThisConnected
                    ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/50'
                    : 'bg-[#101b2d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                    🔌
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{dev.name}</h4>
                      {dev.paired && (
                        <span className="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.2 rounded border border-sky-800">
                          Paired
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {dev.address}
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      Signal: {dev.rssi} dBm • {dev.type}
                    </p>
                  </div>
                </div>

                <div>
                  {isThisConnected ? (
                    <button
                      onClick={onDisconnect}
                      className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 border border-rose-600 text-rose-200 text-xs font-bold rounded-lg shadow transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeviceClick(dev)}
                      disabled={Boolean(connectingAddress)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50 transition-colors"
                    >
                      {isThisConnecting ? 'Pairing...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Communication Log */}
      <div className="bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs font-mono">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
          <span className="text-slate-400 font-bold text-[11px] flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ELM327 Handshake Console</span>
          </span>
          <button
            onClick={() => setLogs(['Console cleared.'])}
            className="text-[10px] text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        </div>
        <div className="max-h-28 overflow-y-auto custom-scroll space-y-1 text-slate-300 text-[11px]">
          {logs.map((log, i) => (
            <div
              key={i}
              className={
                log.startsWith('>')
                  ? 'text-amber-400'
                  : log.startsWith('<')
                  ? 'text-sky-400'
                  : log.startsWith('✓')
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400'
              }
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

