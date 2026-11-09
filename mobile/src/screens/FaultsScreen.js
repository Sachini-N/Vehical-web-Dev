/**
 * FaultsScreen.js
 * DTC Faults Overview Screen (Matches Slide 8 - Screen 3)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import BluetoothService from '../services/BluetoothService';

export default function FaultsScreen({ route, navigation }) {
  // Use passed scan result or default example matching presentation
  const defaultFaults = [
    {
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
    },
  ];

  const initialResult = route?.params?.scanResult?.matchedFaults || defaultFaults;
  const [faults, setFaults] = useState(initialResult);

  const handleClearCodes = () => {
    Alert.alert(
      'Clear Fault Codes',
      'Are you sure you want to send OBD Mode 04 to clear ECU trouble codes? This will turn off the Check Engine light until the next fault cycle.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Codes',
          style: 'destructive',
          onPress: async () => {
            await BluetoothService.clearDiagnosticTroubleCodes();
            setFaults([]);
            Alert.alert('Codes Cleared', 'ECU fault codes have been cleared.');
          },
        },
      ]
    );
  };

  const hasFaults = faults.length > 0;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Faults</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Banner */}
        {hasFaults ? (
          <View style={styles.dangerBanner}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>⚠️</Text>
            <View>
              <Text style={styles.dangerBannerTitle}>Engine Fault Detected</Text>
              <Text style={styles.dangerBannerSubtitle}>{faults.length} active fault(s) found</Text>
            </View>
          </View>
        ) : (
          <View style={styles.successBanner}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>✅</Text>
            <View>
              <Text style={styles.successBannerTitle}>Vehicle Condition: Normal</Text>
              <Text style={styles.successBannerSubtitle}>No Known DTC Faults Detected</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionHeading}>Diagnostic Trouble Codes (DTC)</Text>

        {/* Fault Cards */}
        {faults.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faultCard}
            onPress={() => navigation.navigate('FaultDetails', { fault: item })}
          >
            <View style={styles.faultHeader}>
              <View style={styles.codeRow}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>❗</Text>
                <Text style={styles.codeText}>{item.dtcCode}</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>

            <Text style={styles.faultDesc}>{item.faultDescription}</Text>

            <View style={styles.causesPreview}>
              <Text style={styles.causesTitle}>⚠️ Possible Causes:</Text>
              {item.possibleCauses.slice(0, 3).map((cause, cIdx) => (
                <Text key={cIdx} style={styles.causeItem}>• {cause}</Text>
              ))}
            </View>

            {/* Recommended Actions from Excel Sheet */}
            <View style={styles.actionsPreview}>
              <Text style={styles.actionsTitle}>🛠️ Recommended Actions (කරන්න ඕන දේවල්):</Text>
              {item.recommendedActions.slice(0, 3).map((action, aIdx) => (
                <Text key={aIdx} style={styles.actionItem}>✓ {action}</Text>
              ))}
            </View>

            <View style={styles.viewDetailsRow}>
              <Text style={styles.viewDetailsText}>View Complete Diagnostic Details ›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Clear Fault Codes Button (Matches Slide 8) */}
        {hasFaults && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearCodes}>
            <Text style={styles.clearBtnText}>Clear Fault Codes</Text>
          </TouchableOpacity>
        )}
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
  content: { padding: 16 },
  dangerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
  },
  dangerBannerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  dangerBannerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
  },
  successBannerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  successBannerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  sectionHeading: { color: '#8fa0b5', fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' },
  faultCard: {
    backgroundColor: '#0f1c33',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22385e',
  },
  faultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeRow: { flexDirection: 'row', alignItems: 'center' },
  codeText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  activeBadge: { backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  faultDesc: { color: '#94a3b8', fontSize: 14, marginTop: 8, fontWeight: '500' },
  causesPreview: { marginTop: 12, paddingLeft: 4 },
  causesTitle: { color: '#f87171', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  causeItem: { color: '#94a3b8', fontSize: 12, lineHeight: 18 },
  actionsPreview: { 
    marginTop: 12, 
    padding: 10, 
    backgroundColor: 'rgba(5, 150, 105, 0.15)', 
    borderRadius: 8, 
    borderLeftWidth: 3, 
    borderLeftColor: '#10b981' 
  },
  actionsTitle: { color: '#34d399', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  actionItem: { color: '#a7f3d0', fontSize: 12, lineHeight: 18, fontWeight: '500' },
  viewDetailsRow: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1a2b49' },
  viewDetailsText: { color: '#38bdf8', fontSize: 13, fontWeight: 'bold' },
  clearBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  clearBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});

