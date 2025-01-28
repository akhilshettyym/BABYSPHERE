import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SensorData } from '../types/SensorData';

interface NewSensorGraphProps {
  data: SensorData[];
  selectedSensor: string;
}

const NewSensorGraph: React.FC<NewSensorGraphProps> = ({ data, selectedSensor }) => {
  const chartData = data.map(item => ({
    value: item[selectedSensor as keyof SensorData] as number,
    label: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(180, 227, 167, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Graph</Text>
      <LineChart
        data={{
          labels: chartData.map(item => item.label),
          datasets: [{ data: chartData.map(item => item.value) }],
        }}
        width={Dimensions.get('window').width - 60}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default NewSensorGraph;

