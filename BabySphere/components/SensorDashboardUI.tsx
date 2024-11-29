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
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Sensor Values</Text>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.label}>Heart Rate</Text>
          <Text style={styles.value}>{formatValue(latestData.heart_rate)} bpm</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Baby Temp</Text>
          <Text style={styles.value}>{formatValue(latestData.baby_temperature)}°C</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Humidity</Text>
          <Text style={styles.value}>{formatValue(latestData.humidity)}%</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>SPO2</Text>
          <Text style={styles.value}>{formatValue(latestData.spo2)}%</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Ambient Temp</Text>
          <Text style={styles.value}>{formatValue(latestData.ambient_temperature)}°C</Text>
        </View>
      </View>

      {/* Button to view graphs */}
      <TouchableOpacity style={styles.button} onPress={() => openModal('graph')}>
        <Text style={styles.buttonText}>View Graphs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF', // White background
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A3D8F4', // Heading color
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row', // Align items in a row
    flexWrap: 'wrap', // Wrap to the next line if needed
    justifyContent: 'space-between', // Space between each value
  },
  item: {
    width: '45%', // Adjust width to fit 2 items in a row
    alignItems: 'center', // Center align text
    marginBottom: 15, // Space between rows
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A4A4A', // Dark gray color for label
    marginBottom: 5,
    textAlign: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B4E3A7', // Green color for the value
  },
  graphPlaceholder: {
    height: 200,
    backgroundColor: '#E0E0E0', // Light gray placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  graphText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#FDC1C5', // Button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
});

export default SensorDashboardUI;