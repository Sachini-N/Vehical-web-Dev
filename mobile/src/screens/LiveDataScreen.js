/**
 * LiveDataScreen.js
 * Real-Time Engine Sensors Monitoring (Matches Slide 8 - Screen 2)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BluetoothService from '../services/BluetoothService';

export default function LiveDataScreen({ navigation }) {
  const [sensors, setSensors] = useState({
    rpm: 1402,
    speed: 0,
    ect: 51,
    iat: 35,
    tps: 14.5,
    maf: 2.8,
    map: 36,
    o2: 0.72,
  });

  useEffect(() => {
    // Start continuous live polling at 1000ms
    BluetoothService.startLiveStream(1000, (data) => {
      setSensors((prev) => ({ ...prev, ...data }));
    });

    return () => {
      BluetoothService.stopLiveStream();
    };
  }, []);

  const sensorCards = [
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
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Live Data</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {sensorCards.map((item, idx) => (
          <View key={idx} style={styles.sensorCard}>
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.sensorName}>{item.name}</Text>
              <Text style={styles.sensorRange}>{item.range}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sensorValue}>{item.val} {item.unit}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070f1e' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#16233b',
  },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  topTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', flex: 1 },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 },
  liveText: { color: '#10b981', fontSize: 11, fontWeight: 'bold' },
  list: { padding: 16, gap: 10 },
  sensorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1c33',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#192a4a',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1b2d4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorName: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  sensorRange: { color: '#64748b', fontSize: 11, marginTop: 2 },
  sensorValue: { color: '#38bdf8', fontSize: 17, fontWeight: 'bold' },
});

