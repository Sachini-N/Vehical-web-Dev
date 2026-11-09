/**
 * App.js
 * React Native Navigation & Main Entry Point
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import LiveDataScreen from './src/screens/LiveDataScreen';
import FaultsScreen from './src/screens/FaultsScreen';
import FaultDetailsScreen from './src/screens/FaultDetailsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import VehicleSelectModal from './src/screens/VehicleSelectModal';
import BluetoothScanScreen from './src/screens/BluetoothScanScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BluetoothScan" component={BluetoothScanScreen} />
        <Stack.Screen name="LiveData" component={LiveDataScreen} />
        <Stack.Screen name="Faults" component={FaultsScreen} />
        <Stack.Screen name="FaultDetails" component={FaultDetailsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="VehicleSelect"
          component={VehicleSelectModal}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

