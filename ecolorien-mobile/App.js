import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    light: null
  });

  useEffect(() => {
    const dummyData = {
      temperature: 24,
      humidity: 0.45,
      light: 1785
    };
    setSensorData(dummyData);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>EcoLorien Sensor Data</Text>
      <Text style={styles.data}>Temperature: {sensorData.temperature} °C</Text>
      <Text style={styles.data}>Humidity: {sensorData.humidity * 100}%</Text>
      <Text style={styles.data}>Light: {sensorData.light} lux</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  data: {
    fontSize: 18,
    marginBottom: 10,
  },
});
