/**
 * RegisterScreen.js
 * React Native User & Vehicle Registration Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function RegisterScreen({ navigation, route }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Vehicle info
  const [vehicleBrand, setVehicleBrand] = useState('SUZUKI');
  const [vehicleModel, setVehicleModel] = useState('Wagon R');
  const [licensePlate, setLicensePlate] = useState('WP CAC-4589');
  const [year, setYear] = useState('2018');
  const [fuelType, setFuelType] = useState('Petrol / Hybrid');
  const [mileage, setMileage] = useState('68500');

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in Name, Email and Password.');
      return;
    }
    if (!licensePlate.trim()) {
      Alert.alert('Vehicle Number Required', 'Please enter your vehicle license plate number.');
      return;
    }

    const newUser = {
      fullName,
      email,
      phone,
      vehicles: [
        {
          brand: vehicleBrand,
          model: vehicleModel,
          licensePlate: licensePlate.toUpperCase().trim(),
          year: parseInt(year, 10) || 2018,
          fuelType,
          mileage: parseInt(mileage, 10) || 0,
          isPrimary: true,
        },
      ],
    };

    if (route?.params?.onUserRegistered) {
      route.params.onUserRegistered(newUser);
    }

    Alert.alert(
      'Registration Complete',
      `Welcome ${fullName}! Your vehicle ${vehicleBrand} ${vehicleModel} (${licensePlate}) has been registered in MongoDB.`,
      [{ text: 'Start Diagnosis', onPress: () => navigation.navigate('Home', { user: newUser }) }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Register Account & Vehicle</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Owner / Driver Details</Text>
          <TextInput
            placeholder="Full Name (e.g. Kasun Perera)"
            placeholderTextColor="#64748b"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number (e.g. 077 123 4567)"
            placeholderTextColor="#64748b"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* Vehicle Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🚗 Vehicle Registration (OBD-II)</Text>
          <TextInput
            placeholder="Vehicle Brand (e.g. SUZUKI, TOYOTA, HONDA)"
            placeholderTextColor="#64748b"
            value={vehicleBrand}
            onChangeText={setVehicleBrand}
            style={styles.input}
          />
          <TextInput
            placeholder="Vehicle Model (e.g. Wagon R, Prius, Vezel)"
            placeholderTextColor="#64748b"
            value={vehicleModel}
            onChangeText={setVehicleModel}
            style={styles.input}
          />
          <TextInput
            placeholder="License Plate No (e.g. WP CAC-4589)"
            placeholderTextColor="#64748b"
            value={licensePlate}
            onChangeText={setLicensePlate}
            autoCapitalize="characters"
            style={styles.input}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              placeholder="Year (e.g. 2018)"
              placeholderTextColor="#64748b"
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              placeholder="Mileage km"
              placeholderTextColor="#64748b"
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
          <Text style={styles.submitBtnText}>✓ Complete Registration</Text>
        </TouchableOpacity>
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
  backArrow: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  topTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: '#0f1c33',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#192b4c',
    gap: 10,
  },
  sectionTitle: { color: '#38bdf8', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  input: {
    backgroundColor: '#071120',
    color: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});

