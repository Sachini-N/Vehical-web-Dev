/**
 * HistoryScreen.js
 * Past Vehicle Diagnostic Scans History (Retrieved from MongoDB)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API_BASE_URL}/scans`);
        const data = await res.json();
        if (data.success && data.data) {
          setHistory(data.data);
        }
      } catch (e) {
        console.log('Error fetching history:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan History</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
              <Text style={styles.emptyTitle}>No Scan History Yet</Text>
              <Text style={styles.emptyDesc}>
                Connect to an ELM327 adapter and run a vehicle scan to save diagnostic logs to
                MongoDB.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isFault = item.condition === 'FAULT_DETECTED' || (item.detectedDTCs && item.detectedDTCs.length > 0);
            return (
              <View style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.vehicleTitle}>
                      {item.vehicle?.brand} {item.vehicle?.model}
                    </Text>
                    <Text style={styles.dateText}>
                      {new Date(item.scanDate || item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, isFault ? styles.badgeFault : styles.badgeNormal]}>
                    <Text style={styles.statusText}>{isFault ? 'Fault Detected' : 'Normal'}</Text>
                  </View>
                </View>

                {/* DTC Codes Chips */}
                {item.detectedDTCs && item.detectedDTCs.length > 0 && (
                  <View style={styles.dtcRow}>
                    <Text style={styles.dtcLabel}>Codes: </Text>
                    {item.detectedDTCs.map((code, idx) => (
                      <View key={idx} style={styles.codeChip}>
                        <Text style={styles.codeChipText}>{code}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Sensors Snapshot */}
                {item.sensorReadings && (
                  <View style={styles.sensorGrid}>
                    <Text style={styles.sensorItem}>RPM: {item.sensorReadings.rpm || 0}</Text>
                    <Text style={styles.sensorItem}>Speed: {item.sensorReadings.speed || 0} km/h</Text>
                    <Text style={styles.sensorItem}>ECT: {item.sensorReadings.ect || 0} °C</Text>
                    <Text style={styles.sensorItem}>MAF: {item.sensorReadings.maf || 0} g/s</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
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
  topTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  list: { padding: 16 },
  historyCard: {
    backgroundColor: '#0f1c33',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#192b4c',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vehicleTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  dateText: { color: '#64748b', fontSize: 11, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeFault: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: '#ef4444' },
  badgeNormal: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1, borderColor: '#10b981' },
  statusText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  dtcRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  dtcLabel: { color: '#94a3b8', fontSize: 12 },
  codeChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeChipText: { color: '#f87171', fontSize: 11, fontWeight: 'bold' },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a2b49',
  },
  sensorItem: { color: '#94a3b8', fontSize: 11 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  emptyDesc: { color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
});

