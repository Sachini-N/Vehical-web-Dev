/**
 * VehicleSelectModal.js
 * Vehicle Brand & Model Selector (Dynamically populated from MongoDB/Excel)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import ApiService from '../services/ApiService';

export default function VehicleSelectModal({ route, navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  useEffect(() => {
    async function load() {
      const list = await ApiService.getVehicles();
      setVehicles(list);
      setFiltered(list);
    }
    load();
  }, []);

  const brands = ['ALL', ...new Set(vehicles.map((v) => v.brand))];

  const handleSelect = (v) => {
    if (route?.params?.setSelectedVehicle) {
      route.params.setSelectedVehicle({ brand: v.brand, model: v.model });
    }
    navigation.goBack();
  };

  const handleFilter = (text, brand = selectedBrand) => {
    setSearch(text);
    let temp = vehicles;
    if (brand !== 'ALL') {
      temp = temp.filter((v) => v.brand === brand);
    }
    if (text) {
      temp = temp.filter(
        (v) =>
          v.model.toLowerCase().includes(text.toLowerCase()) ||
          v.brand.toLowerCase().includes(text.toLowerCase())
      );
    }
    setFiltered(temp);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Select Vehicle Model</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search brand or model (e.g. Wagon R, Prius...)"
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={(txt) => handleFilter(txt)}
          style={styles.searchInput}
        />
      </View>

      {/* Brand Chips */}
      <View style={styles.brandChips}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={brands}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, selectedBrand === item && styles.chipActive]}
              onPress={() => {
                setSelectedBrand(item);
                handleFilter(search, item);
              }}
            >
              <Text style={[styles.chipText, selectedBrand === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Vehicle Models List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.brand}_${item.model}_${index}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemRow} onPress={() => handleSelect(item)}>
            <View>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemModel}>{item.model}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        )}
      />
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
  backArrow: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  topTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  searchBox: { paddingHorizontal: 16, paddingTop: 12 },
  searchInput: {
    backgroundColor: '#0f1c33',
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  brandChips: { paddingVertical: 12, paddingLeft: 16 },
  chip: {
    backgroundColor: '#0f1c33',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  chipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f1c33',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#192b4c',
  },
  itemBrand: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  itemModel: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginTop: 2 },
  arrowIcon: { color: '#64748b', fontSize: 20 },
});

