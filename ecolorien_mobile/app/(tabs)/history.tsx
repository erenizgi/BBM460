import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        try {
          const stored = await AsyncStorage.getItem('sensorHistory');
          if (stored) {
            const parsed = JSON.parse(stored);
            setHistory(parsed);
          }
        } catch (err) {
          console.error('Failed to load sensor history:', err);
        }
      };
      loadHistory();
    }, [])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
  <View style={styles.item}>
    {item.timestamp && (
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    )}
    <Text style={styles.title}>#{index + 1}</Text>
    <Text>Temp: {item.temperature} °C</Text>
    <Text>Humidity: {item.humidity} %</Text>
    <Text>Light: {item.light} lux</Text>
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sensor Data History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  marginTop: 40, 
},
  item: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
   reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  timestamp: {
  fontSize: 12,
  color: '#555',
  marginBottom: 4,
},
});
