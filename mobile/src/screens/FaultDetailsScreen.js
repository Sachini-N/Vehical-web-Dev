/**
 * FaultDetailsScreen.js
 * Comprehensive Fault Breakdown & Recommendations (Matches Slide 8 - Screen 4)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function FaultDetailsScreen({ route, navigation }) {
  const fault = route?.params?.fault || {
    dtcCode: 'P0101',
    sensor: 'MAF',
    faultDescription: 'Mass Air Flow (MAF) Sensor Range/Performance',
    possibleCauses: [
      'Faulty MAF sensor',
      'Wiring or connector issue',
      'Vacuum leak',
      'ECU issue',
    ],
    recommendedActions: [
      'Check MAF sensor and wiring',
      'Inspect for vacuum leaks',
      'Clear code and test drive',
      'Replace sensor if necessary',
    ],
    severity: 'High',
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Fault Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Code & Severity Badge */}
        <View style={styles.codeHeader}>
          <View style={styles.codeIconRow}>
            <Text style={{ fontSize: 28, marginRight: 10 }}>⚠️</Text>
            <View>
              <Text style={styles.dtcTitle}>{fault.dtcCode}</Text>
              <Text style={styles.sensorSub}>{fault.sensor} Sensor</Text>
            </View>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        </View>

        <Text style={styles.primaryDescTitle}>{fault.faultDescription}</Text>

        {/* Section 1: Detailed Description */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.bodyText}>
            The Engine Control Module (ECM) has detected that the {fault.sensor} sensor signal is
            outside the expected operating threshold or response is abnormal for current vehicle
            operating conditions.
          </Text>
        </View>

        {/* Section 2: Possible Causes */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>Possible Causes</Text>
          {fault.possibleCauses.map((cause, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{cause}</Text>
            </View>
          ))}
        </View>

        {/* Section 3: Recommended Action */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>Recommended Action</Text>
          {fault.recommendedActions.map((action, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bulletDotGreen}>✓</Text>
              <Text style={styles.bulletText}>{action}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer Card */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Safety & Repair Advisory</Text>
          <Text style={styles.disclaimerText}>
            These recommendations are diagnostic suggestions based on OBD-II fault codes and sensor
            data. Please verify electrical connections and sensor specifications with a multimeter
            or qualified technician before purchasing replacement parts.
          </Text>
        </View>
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
  topTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 18 },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeIconRow: { flexDirection: 'row', alignItems: 'center' },
  dtcTitle: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  sensorSub: { color: '#38bdf8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  activeBadge: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  primaryDescTitle: { color: '#cbd5e1', fontSize: 16, fontWeight: '600', marginBottom: 20 },
  cardSection: {
    backgroundColor: '#0f1c33',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#192b4c',
  },
  sectionHeader: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  bodyText: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { color: '#ef4444', fontSize: 16, marginRight: 8, marginTop: -2 },
  bulletDotGreen: { color: '#10b981', fontSize: 14, marginRight: 8, fontWeight: 'bold' },
  bulletText: { color: '#cbd5e1', fontSize: 13, flex: 1, lineHeight: 19 },
  disclaimerBox: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
    marginBottom: 30,
  },
  disclaimerTitle: { color: '#facc15', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  disclaimerText: { color: '#e2e8f0', fontSize: 11, lineHeight: 16 },
});

