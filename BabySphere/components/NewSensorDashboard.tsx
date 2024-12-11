import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { SensorData } from '../types/SensorData';

interface NewSensorDashboardProps {
  data: SensorData[];
  isDarkMode: boolean;
}

const NewSensorDashboard: React.FC<NewSensorDashboardProps> = ({ data, isDarkMode }) => {
  const [selectedSensor, setSelectedSensor] = useState<keyof SensorData | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSensor && data.length > 0) {
      const latestData = data.slice(-10); // Last 10 data points
      setChartData(latestData.map(item => Number(item[selectedSensor]) || 0));
      setChartLabels(latestData.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })));
    }
  }, [selectedSensor, data]);

  const latestData = data[data.length - 1] || {};

  const renderSensorCard = (title: string, value: number | string, unit: string, icon: string, key: keyof SensorData) => (
    <TouchableOpacity
      style={[styles.sensorCard, isDarkMode && styles.darkSensorCard]}
      onPress={() => setSelectedSensor(key)}
      accessibilityLabel={`${title}: ${value} ${unit}`}
      accessibilityHint={`Tap to view ${title} chart`}
    >
      <Ionicons name={icon as any} size={24} color={isDarkMode ? "#B4E3A7" : "#8AA9B8"} />
      <Text style={[styles.sensorTitle, isDarkMode && styles.darkText]}>{title}</Text>
      <Text style={[styles.sensorValue, isDarkMode && styles.darkText]}>
        {typeof value === 'number' ? value.toFixed(1) : value} <Text style={styles.sensorUnit}>{unit}</Text>
      </Text>
    </TouchableOpacity>
  );

  const renderGraph = () => {
    if (!selectedSensor || chartData.length === 0) return null;

    const sensorName = selectedSensor as string;

    return (
      <View style={[styles.graphContainer, isDarkMode && styles.darkGraphContainer]}>
        <Text style={[styles.graphTitle, isDarkMode && styles.darkText]}>{sensorName.charAt(0).toUpperCase() + sensorName.slice(1)}</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }],
            }}
            width={Dimensions.get('window').width - 70}
            height={220}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              decimalPlaces: selectedSensor === 'temperature' ? 1 : 0,
              color: (opacity = 1) => isDarkMode ? `rgba(180, 227, 167, ${opacity})` : `rgba(138, 169, 184, ${opacity})`,
              labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(138, 169, 184, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: isDarkMode ? '#B4E3A7' : '#8AA9B8',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setSelectedSensor(null)}
          accessibilityLabel="Close chart"
        >
          <Ionicons name="close" size={24} color={isDarkMode ? "#B4E3A7" : "#8AA9B8"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sensorGrid}>
        {renderSensorCard('Temperature', latestData.temperature || 0, '°C', 'thermometer', 'temperature')}
        {renderSensorCard('SpO2', latestData.spo2 || 0, '%', 'pulse', 'spo2')}
        {renderSensorCard('Heart Rate', latestData.heartRate || 0, 'bpm', 'heart', 'heartRate')}
        {renderSensorCard('Humidity', latestData.humidity || 0, '%', 'water', 'humidity')}
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
    shadowOffset: { width:0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSensorCard: {
    backgroundColor: '#2C2C2C',
    shadowColor: '#FFFFFF',
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
  darkText: {
    color: '#FFFFFF',
  },
  graphContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  darkGraphContainer: {
    backgroundColor: '#2C2C2C',
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
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewSensorDashboard;

