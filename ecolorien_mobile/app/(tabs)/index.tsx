import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [sensorData, setSensorData] = useState<any>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://192.168.1.115:3001/api/sensorData')
        .then(res => res.json())
        .then(json => {
          setSensorData(json.data);
          storeSensorData({ ...json.data, timestamp: new Date().toISOString() });
        })
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const storeSensorData = async (data: any) => {
    try {
      const existing = await AsyncStorage.getItem('sensorHistory');
      const parsed = existing ? JSON.parse(existing) : [];
      const newHistory = [data, ...parsed].slice(0, 50);
      await AsyncStorage.setItem('sensorHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Error saving history:', err);
    }
  };

  const getColor = (key: string, value: number): string => {
    switch (key) {
      case 'temperature':
        if (value >= 18 && value <= 26) return 'green';
        if (value < 18) return 'blue';
        if (value > 26 && value <= 32) return 'orange';
        return 'red';

      case 'humidity':
        if (value >= 30 && value <= 55) return 'green';
        if (value >= 25 && value < 30) return 'blue';
        if (value > 55 && value <= 65) return 'orange';
        return 'red';

      case 'light':
        if (value >= 300 && value <= 2000) return 'green';
        if (value < 300) return 'blue';
        if (value > 2000 && value <= 2200) return 'orange';
        return 'red';

      default:
        return 'black';
    }
  };

  const getBarFillPercent = (key: string, value: number): number => {
    const color = getColor(key, value);
    if (color === 'blue') return 0.1;
    if (color === 'orange' || color === 'red') return 1;

    let ratio = 0;
    switch (key) {
      case 'temperature':
        ratio = (value - 18) / (26 - 18);
        break;
      case 'humidity':
        ratio = (value - 0.3) / (0.6 - 0.3);
        break;
      case 'light':
        ratio = (value - 300) / (2000 - 300);
        break;
    }
    return Math.min(Math.max(ratio, 0), 1);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.reactLogo}
          />
        </View>
      }
    >
      {sensorData && (
        <View style={styles.sensorContainer}>
          {['temperature', 'humidity', 'light'].map((key) => {
            const fillRatio = getBarFillPercent(key, sensorData[key]);
            const barColor = getColor(key, sensorData[key]);
            const value = sensorData[key];

            return (
              <View key={key} style={styles.sensorBlock}>
                <Text style={styles.label}>
                  {key.toUpperCase()}: {value}
                  {key === 'temperature' && ' °C'}
                  {key === 'humidity' && ' %'}
                  {key === 'light' && ' lux'}
                </Text>

                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${fillRatio * 100}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>
          ✧༝┉┉┉┉┉˚*❋ ❋ ❋*˚┉┉┉┉┉༝✧{'\n'}
          ECOLORIEN Sensor Value Descriptions:{'\n'}
          ✧༝┉┉┉┉┉˚*❋ ❋ ❋*˚┉┉┉┉┉༝✧
        </Text>
        <Text style={[styles.legendItem, { color: 'green' }]}>
          ● Green: Value is within the normal range.
        </Text>
        <Text style={[styles.legendItem, { color: 'blue' }]}>
          ● Blue: Value is below the normal range.
        </Text>
        <Text style={[styles.legendItem, { color: 'orange' }]}>
          ● Orange: Value is slightly above normal.
        </Text>
        <Text style={[styles.legendItem, { color: 'red' }]}>
          ● Red: Value is critically high — requires attention.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  sensorContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 25,
  },
  sensorBlock: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  barBackground: {
    width: '100%',
    height: 18,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  legendContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  logoContainer: {
    backgroundColor: '#f8fcfc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  reactLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
