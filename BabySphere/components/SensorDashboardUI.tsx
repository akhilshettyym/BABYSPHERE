import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SensorDashboardUIProps {
  latestData: any; // Replace 'any' with proper typing if available
  openModal: (sensor: string) => void;
}

const SensorDashboardUI: React.FC<SensorDashboardUIProps> = ({ latestData, openModal }) => {
  return (
    <View style={styles.container}>
      {/* Render sensor cards */}
      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFCDD2' }]} onPress={() => openModal('ambient_temperature')}>
        <Text style={styles.label}>Ambient Temp</Text>
        <Text style={styles.value}>{latestData.ambient_temperature?.toFixed(2) ?? 'N/A'}°C</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, { backgroundColor: '#C8E6C9' }]} onPress={() => openModal('object_temperature')}>
        <Text style={styles.label}>Object Temp</Text>
        <Text style={styles.value}>{latestData.object_temperature?.toFixed(2) ?? 'N/A'}°C</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, { backgroundColor: '#BBDEFB' }]} onPress={() => openModal('temperature')}>
        <Text style={styles.label}>Temperature</Text>
        <Text style={styles.value}>{latestData.temperature?.toFixed(2) ?? 'N/A'}°C</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF9C4' }]} onPress={() => openModal('humidity')}>
        <Text style={styles.label}>Humidity</Text>
        <Text style={styles.value}>{latestData.humidity?.toFixed(2) ?? 'N/A'}%</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF', // White background
  },
  card: {
    width: '45%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
    color: '#000000',
  },
});

export default SensorDashboardUI;
