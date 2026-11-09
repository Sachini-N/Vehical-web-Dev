/**
 * BluetoothService.js
 * ELM327 Bluetooth Classic (SPP) Connection and OBD-II Data Pipeline
 */

const OBDParser = require('./OBDParser');

class BluetoothService {
  constructor() {
    this.connectedDevice = null;
    this.isConnected = false;
    this.isDemoMode = false;
    this.pollingInterval = null;
    this.onDataListener = null;

    // Simulated sensor baseline state for Demo/Testing Mode
    this.mockState = {
      rpm: 1402,
      speed: 0,
      ect: 51,
      iat: 35,
      tps: 14.5,
      maf: 2.8,
      map: 36,
      o2: 0.72,
      activeDtc: 'P0101', // Example fault matching presentation slide 8
    };
  }

  /**
   * Request Bluetooth permissions and list bonded devices
   */
  async getBondedDevices() {
    if (this.isDemoMode) {
      return [
        { name: 'OBDII (ELM327 Bluetooth)', address: '00:1D:A5:68:98:8B' },
        { name: 'Car Scanner Adapter', address: '00:1B:35:12:34:56' },
      ];
    }
    // In React Native:
    // const RNBluetooth = require('react-native-bluetooth-classic').default;
    // return await RNBluetooth.getBondedDevices();
    return [
      { name: 'OBDII (ELM327)', address: '00:1D:A5:68:98:8B' },
    ];
  }

  /**
   * Connect to ELM327 via Bluetooth SPP (Serial Port Profile)
   */
  async connect(deviceAddress, enableDemo = false) {
    if (enableDemo || deviceAddress === 'SIMULATOR') {
      this.isDemoMode = true;
      this.isConnected = true;
      this.connectedDevice = { name: 'ELM327 (Simulator)', address: 'SIMULATOR' };
      console.log('[OBD-II] Connected to Simulator');
      return true;
    }

    try {
      console.log(`[OBD-II] Connecting to Bluetooth device ${deviceAddress}...`);
      // In React Native:
      // const RNBluetooth = require('react-native-bluetooth-classic').default;
      // this.connectedDevice = await RNBluetooth.connectToDevice(deviceAddress);
      this.isConnected = true;
      await this.initializeELM327();
      return true;
    } catch (err) {
      console.error('[OBD-II Connection Error]:', err.message);
      this.isConnected = false;
      throw err;
    }
  }

  /**
   * Initialize ELM327 protocol and options
   */
  async initializeELM327() {
    if (this.isDemoMode) return true;

    // Standard ELM327 AT configuration sequence
    const initCommands = [
      'AT Z\r',   // Reset all
      'AT E0\r',  // Echo off
      'AT L0\r',  // Linefeeds off
      'AT S0\r',  // Spaces off
      'AT H0\r',  // Headers off
      'AT SP 0\r' // Automatic protocol selection
    ];

    for (const cmd of initCommands) {
      await this.writeRaw(cmd);
      await new Promise((r) => setTimeout(r, 150));
    }

    console.log('[OBD-II] ELM327 initialized successfully.');
    return true;
  }

  /**
   * Send raw command string over Bluetooth
   */
  async writeRaw(cmd) {
    if (this.isDemoMode) return 'OK';
    if (!this.connectedDevice) throw new Error('Not connected to OBD-II device');
    // return await this.connectedDevice.write(cmd);
    return 'OK';
  }

  /**
   * Read single OBD PID
   */
  async queryPID(pidHex) {
    if (this.isDemoMode) {
      return this.mockPidResponse(pidHex);
    }
    const raw = await this.writeRaw(`01${pidHex}\r`);
    return OBDParser.parseSensorPID(raw, pidHex);
  }

  /**
   * Query all active sensors
   */
  async readLiveSensors() {
    if (this.isDemoMode) {
      // Simulate live jittering vehicle data
      const jitter = (val, delta, min, max) =>
        Math.min(max, Math.max(min, Number((val + (Math.random() * 2 - 1) * delta).toFixed(1))));

      this.mockState.rpm = Math.round(jitter(this.mockState.rpm, 30, 700, 3000));
      this.mockState.speed = Math.round(jitter(this.mockState.speed, 1, 0, 100));
      this.mockState.ect = Math.round(jitter(this.mockState.ect, 0.2, 40, 95));
      this.mockState.tps = jitter(this.mockState.tps, 0.5, 10, 85);
      this.mockState.maf = jitter(this.mockState.maf, 0.1, 1.5, 45.0);
      this.mockState.map = Math.round(jitter(this.mockState.map, 0.5, 25, 95));
      this.mockState.o2 = Number((0.1 + Math.random() * 0.8).toFixed(2));

      return { ...this.mockState };
    }

    const sensors = {};
    const pids = ['0C', '0D', '05', '0F', '11', '10', '0B', '14'];

    for (const pid of pids) {
      try {
        const parsed = await this.queryPID(pid);
        if (parsed) {
          if (pid === '0C') sensors.rpm = parsed.value;
          if (pid === '0D') sensors.speed = parsed.value;
          if (pid === '05') sensors.ect = parsed.value;
          if (pid === '0F') sensors.iat = parsed.value;
          if (pid === '11') sensors.tps = parsed.value;
          if (pid === '10') sensors.maf = parsed.value;
          if (pid === '0B') sensors.map = parsed.value;
          if (pid === '14') sensors.o2 = parsed.value;
        }
      } catch (e) {
        // pid not supported on this vehicle
      }
    }

    return sensors;
  }

  /**
   * Request Stored Diagnostic Trouble Codes (Mode 03)
   */
  async readDiagnosticTroubleCodes() {
    if (this.isDemoMode) {
      return this.mockState.activeDtc ? [this.mockState.activeDtc] : [];
    }

    const raw = await this.writeRaw('03\r');
    return OBDParser.parseDTCs(raw);
  }

  /**
   * Clear Diagnostic Trouble Codes (Mode 04)
   */
  async clearDiagnosticTroubleCodes() {
    if (this.isDemoMode) {
      this.mockState.activeDtc = null;
      return true;
    }
    await this.writeRaw('04\r');
    return true;
  }

  /**
   * Start polling live sensor stream (e.g. 1 Hz)
   */
  startLiveStream(intervalMs = 1000, callback) {
    this.stopLiveStream();
    this.pollingInterval = setInterval(async () => {
      if (!this.isConnected) return;
      try {
        const data = await this.readLiveSensors();
        if (callback) callback(data);
      } catch (err) {
        console.error('Sensor stream error:', err);
      }
    }, intervalMs);
  }

  stopLiveStream() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  disconnect() {
    this.stopLiveStream();
    this.isConnected = false;
    this.connectedDevice = null;
    console.log('[OBD-II] Disconnected.');
  }

  // Helper for mock PIDs
  mockPidResponse(pid) {
    return OBDParser.parseSensorPID(`41${pid}1FA0`, pid);
  }
}

module.exports = new BluetoothService();

