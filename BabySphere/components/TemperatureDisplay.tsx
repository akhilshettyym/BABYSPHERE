import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TemperatureDisplayProps {
  temperatures: {
    current: number;
    set: number;
    max: number;
  };
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ temperatures }) => {
  return (
    <View style={styles.container}>
      <View style={styles.temperatureBox}>
        <Text style={styles.temperature}>{temperatures.current.toFixed(1)}°C</Text>
        <Text style={styles.label}>Temperature °C</Text>
      </View>
      <View style={styles.temperatureBox}>
        <Text style={styles.temperature}>{temperatures.set.toFixed(2)}C</Text>
        <Text style={styles.label}>Set Goal #1</Text>
      </View>
      <View style={styles.temperatureBox}>
        <Text style={styles.temperature}>{temperatures.max.toFixed(3)}°C</Text>
        <Text style={styles.label}>Max 55</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  temperatureBox: {
    flex: 1,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  label: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
});

export default TemperatureDisplay;

