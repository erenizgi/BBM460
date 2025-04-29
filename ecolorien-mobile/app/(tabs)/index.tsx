import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [sensorData, setSensorData] = useState<{
    temperature: number | null;
    humidity: number | null;
    light: number | null;
  }>({
    temperature: null,
    humidity: null,
    light: null
  });

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://192.168.1.117:3001/api/sensorData');
      const json = await response.json();
      const rawData = json.data;
      const parsedData = {
        temperature: parseFloat(rawData.temperature),
        humidity: parseFloat(rawData.humidity) / 100,  // yüzde formatına çevirmek için
        light: parseFloat(rawData.light)
      };
      setSensorData(parsedData);
    } catch (error) {
      console.error('Sensor verisi alınamadı:', error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBarColor = (value: number, min: number, max: number): string => {
    if (value >= min && value <= max) {
      return 'green';
    }
    return 'red';
  };

  return (
    <View style={styles.container}>
<Text style={styles.label}>Temperature: {sensorData.temperature} °C</Text>
<View style={[
  styles.bar,
  {
    backgroundColor: getBarColor(sensorData.temperature ?? 0, 20, 27),
    width: `${((sensorData.temperature ?? 0) / 40) * 100}%`
  }
]} />

<Text style={styles.label}>Humidity: {(sensorData.humidity ?? 0) * 100}%</Text>
<View style={[
  styles.bar,
  {
    backgroundColor: getBarColor((sensorData.humidity ?? 0) * 100, 40, 60),
    width: `${(sensorData.humidity ?? 0) * 100}%`
  }
]} />

<Text style={styles.label}>Light: {sensorData.light} lux</Text>
<View style={[
  styles.bar,
  {
    backgroundColor: getBarColor(sensorData.light ?? 0, 300, 500),
    width: `${((sensorData.light ?? 0) / 1500) * 100}%`
  }
]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#e0f7fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginTop: 20,
  },
  bar: {
    height: 20,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },
});
