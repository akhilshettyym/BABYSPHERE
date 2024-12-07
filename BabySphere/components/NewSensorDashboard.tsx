import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { SensorData } from '../types/SensorData';

interface NewSensorDashboardProps {
  data: SensorData[];
}

const NewSensorDashboard: React.FC<NewSensorDashboardProps> = ({ data }) => {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSensor && data.length > 0) {
      const latestData = data.slice(-10); // Last 10 data points
      setChartData(latestData.map(item => item[selectedSensor as keyof SensorData] as number));
      setChartLabels(latestData.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })));
    }
  }, [selectedSensor, data]);

  const latestData = data[data.length - 1] || {};

  const renderSensorCard = (title: string, value: number | string, unit: string, icon: string, key: string) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => setSelectedSensor(key)}
    >
      <Ionicons name={icon as any} size={24} color="#8AA9B8" />
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorValue}>
        {value} <Text style={styles.sensorUnit}>{unit}</Text>
      </Text>
    </TouchableOpacity>
  );

  const renderGraph = () => {
    if (!selectedSensor || chartData.length === 0) return null;

    return (
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)}</Text>
        <LineChart
          data={{
            labels: chartLabels, // Correctly added labels
            datasets: [{ data: chartData }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: selectedSensor === 'baby_temperature' ? 1 : 0,
            color: (opacity = 1) => `rgba(180, 227, 167, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(138, 169, 184, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#8AA9B8',
            },
          }}
          bezier
          style={styles.chart}
        />
        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSensor(null)}>
          <Ionicons name="close" size={24} color="#8AA9B8" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sensorGrid}>
        {renderSensorCard('Temperature', latestData.baby_temperature?.toFixed(1) || '--', '°C', 'thermometer', 'baby_temperature')}
        {renderSensorCard('SpO2', latestData.spo2?.toFixed(0) || '--', '%', 'pulse', 'spo2')}
        {renderSensorCard('Heart Rate', latestData.heartRate?.toFixed(0) || '--', 'bpm', 'heart', 'heartRate')}
        {renderSensorCard('Humidity', latestData.humidity?.toFixed(0) || '--', '%', 'water', 'humidity')}
      </View>
      {renderGraph()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
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
    marginHorizontal: 10,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default NewSensorDashboard;
