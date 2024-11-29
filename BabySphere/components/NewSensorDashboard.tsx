import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewSensorGraph from './NewSensorGraph';
import { SensorData } from '../types/SensorData';

interface NewSensorDashboardProps {
  data: SensorData[];
}

const NewSensorDashboard: React.FC<NewSensorDashboardProps> = ({ data }) => {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const latestData = data[data.length - 1] || {};

  const renderSensorCard = (title: string, value: number | string, unit: string, icon: string) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => setSelectedSensor(title.toLowerCase())}
    >
      <Ionicons name={icon as any} size={24} color="#8AA9B8" />
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorValue}>
        {value} <Text style={styles.sensorUnit}>{unit}</Text>
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sensorGrid}>
        {renderSensorCard('Temperature', latestData.baby_temperature?.toFixed(1) || '--', '°C', 'thermometer')}
        {renderSensorCard('SpO2', latestData.spo2?.toFixed(0) || '--', '%', 'pulse')}
        {renderSensorCard('Heart Rate', latestData.heartRate?.toFixed(0) || '--', 'bpm', 'heart')}
        {renderSensorCard('Humidity', latestData.humidity?.toFixed(0) || '--', '%', 'water')}
      </View>
      {selectedSensor && (
        <View style={styles.graphContainer}>
          <NewSensorGraph data={data} selectedSensor={selectedSensor} />
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSensor(null)}>
            <Ionicons name="close" size={24} color="#8AA9B8" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorTitle: {
    fontSize: 14,
    color: '#8AA9B8',
    marginTop: 5,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B4E3A7',
    marginTop: 5,
  },
  sensorUnit: {
    fontSize: 14,
    color: '#8AA9B8',
  },
  graphContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default NewSensorDashboard;

