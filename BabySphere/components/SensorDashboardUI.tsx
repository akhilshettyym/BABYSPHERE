import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SensorDashboardUIProps {
  latestData: any; // Replace 'any' with proper typing if available
  openModal: (sensor: string) => void;
}

const SensorDashboardUI: React.FC<SensorDashboardUIProps> = ({ latestData, openModal }) => {
  const formatValue = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (!isNaN(Number(value))) {
      return Number(value).toFixed(2); // Convert strings to numbers and format
    }
    return 'N/A'; // Default case
  };
  
  

  return (
    <View style={styles.container}>
      {/* Render sensor cards based on the provided sensor data */}
      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFCDD2' }]} onPress={() => openModal('ambient_temperature')}>
        <Text style={styles.label}>Ambient Temp</Text>
        <Text style={styles.value}>{formatValue(latestData.ambient_temperature)}°C</Text>
      </TouchableOpacity>



      <TouchableOpacity style={[styles.card, { backgroundColor: '#BBDEFB' }]} onPress={() => openModal('baby_temperature')}>
        <Text style={styles.label}>Baby Temp</Text>
        <Text style={styles.value}>{formatValue(latestData.baby_temperature)}°C</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF9C4' }]} onPress={() => openModal('humidity')}>
        <Text style={styles.label}>Humidity</Text>
        <Text style={styles.value}>{formatValue(latestData.humidity)}%</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFEB3B' }]} onPress={() => openModal('spo2')}>
        <Text style={styles.label}>SPO2</Text>
        <Text style={styles.value}>{formatValue(latestData.spo2)}%</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#FFEB3B' }]} onPress={() => openModal('heart_rate')}>
        <Text style={styles.label}>Heart Rate</Text>
        <Text style={styles.value}>{formatValue(latestData.heart_rate)} bpm</Text>
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
