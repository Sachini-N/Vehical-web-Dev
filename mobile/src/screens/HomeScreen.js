/**
 * HomeScreen.js
 * Vehicle Diagnostic Home Screen (Matches Slide 8 - Screen 1)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BluetoothService from '../services/BluetoothService';
import ApiService from '../services/ApiService';

export default function HomeScreen({ navigation }) {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({
    brand: 'SUZUKI',
    model: 'Wagon R',
  });
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Check initial bluetooth state
    setIsConnected(BluetoothService.isConnected);
  }, []);

  const handleToggleConnection = () => {
    navigation.navigate('BluetoothScan');
  };

  const handleStartScan = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to ELM327 Bluetooth device first.');
      return;
    }

    setIsScanning(true);
    try {
      // 1. Read live sensors
      const sensors = await BluetoothService.readLiveSensors();
      // 2. Read stored DTC codes
      const dtcCodes = await BluetoothService.readDiagnosticTroubleCodes();
      // 3. Match with MongoDB
      const matchResult = await ApiService.matchFaults(
        selectedVehicle.brand,
        selectedVehicle.model,
        dtcCodes
      );

      // 4. Save scan to MongoDB
      await ApiService.saveScan({
        vehicle: selectedVehicle,
        sensorReadings: sensors,
        detectedDTCs: dtcCodes,
        matchedFaults: matchResult.matchedFaults,
        condition: matchResult.condition,
      });

      setIsScanning(false);
      // Navigate to Faults screen
      navigation.navigate('Faults', {
        scanResult: matchResult,
        sensors,
        vehicle: selectedVehicle,
      });
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Scan Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b1320" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerIcon}>🚗</Text>
          <View>
            <Text style={styles.headerTitle}>OBD II</Text>
            <Text style={styles.headerSubtitle}>Vehicle Health Monitor</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsIconBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Connection Status Pill */}
        <TouchableOpacity
          style={[styles.connectionBanner, isConnected ? styles.bgConnected : styles.bgDisconnected]}
          onPress={handleToggleConnection}
        >
          <View style={styles.statusDot} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.connectionTitle}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
            <Text style={styles.connectionSubtitle}>
              {isConnected ? 'ELM327 (Bluetooth SPP)' : 'Tap to scan and connect OBD-II adapter'}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Selected Vehicle Card */}
        <View style={styles.vehicleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleLabel}>Selected Vehicle</Text>
            <Text style={styles.vehicleName}>
              {selectedVehicle.brand} {selectedVehicle.model}
            </Text>
            <Text style={styles.vehicleSub}>Supported Sensors: TPS, ECT, MAF, MAP, O2</Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => navigation.navigate('VehicleSelect', { setSelectedVehicle })}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Start Vehicle Scan Action Button */}
        <TouchableOpacity
          style={styles.startScanButton}
          onPress={handleStartScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startScanButtonText}>🔍 START VEHICLE SCAN</Text>
          )}
        </TouchableOpacity>

        {/* 4 Main Action Cards (Matches Presentation Slide 8) */}
        <View style={styles.actionGrid}>
          {/* 1. Live Data (Blue) */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#1d63d8' }]}
            onPress={() => navigation.navigate('LiveData')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📊</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionTitle}>Live Data</Text>
              <Text style={styles.actionDesc}>View sensor gauges & values</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          {/* 2. Faults (Red) */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#d92d20' }]}
            onPress={() => navigation.navigate('Faults')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>⚠️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionTitle}>Faults</Text>
              <Text style={styles.actionDesc}>Check engine trouble codes (DTC)</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          {/* 3. History (Green) */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#099250' }]}
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🕒</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionTitle}>History</Text>
              <Text style={styles.actionDesc}>Past scans stored in MongoDB</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          {/* 4. Settings (Dark Grey) */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#344054' }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>⚙️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionDesc}>App & Bluetooth configuration</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1320' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#172236',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { fontSize: 26, marginRight: 10 },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#8fa0b5', fontSize: 12 },
  settingsIconBtn: { padding: 8 },
  content: { padding: 18 },
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  bgConnected: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 1, borderColor: '#10b981' },
  bgDisconnected: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: '#ef4444' },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981' },
  connectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  connectionSubtitle: { color: '#94a3b8', fontSize: 12 },
  chevron: { color: '#ffffff', fontSize: 22, fontWeight: '300' },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e31',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#202f48',
  },
  vehicleLabel: { color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleName: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  vehicleSub: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  changeBtn: { backgroundColor: '#1e293b', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  changeBtnText: { color: '#38bdf8', fontSize: 13, fontWeight: '600' },
  startScanButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  startScanButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  actionGrid: { gap: 12 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: { fontSize: 22 },
  actionTitle: { color: '#ffffff', fontSize: 17, fontWeight: 'bold' },
  actionDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  actionArrow: { color: '#ffffff', fontSize: 24, fontWeight: '300' },
});

