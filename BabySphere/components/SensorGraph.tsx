import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartDataPoint } from '../types/babyMonitor';

const { width } = Dimensions.get('window');

interface SensorGraphProps {
  data: ChartDataPoint[];
  title: string;
}


const SensorGraph: React.FC<SensorGraphProps> = ({ data, title }) => {
  if (data.length === 0) {
    return <Text style={styles.noDataText}>No data available for the selected timeframe</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels: data.map(d => d.label),
          datasets: [{ data: data.map(d => d.value) }],
        }}
        width={width - width * 0.1} // 90% of screen width
        height={220}
        chartConfig={{
          backgroundColor: '#F8F9FA',
          backgroundGradientFrom: '#F8F9FA',
          backgroundGradientTo: '#F8F9FA',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(180, 227, 167, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(138, 169, 184, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#8AA9B8',
          },
          propsForLabels: {
            fontSize: width * 0.03,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: width * 0.025,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: width * 0.025,
  },
  chart: {
    marginVertical: width * 0.02,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#8AA9B8',
    fontSize: width * 0.04,
    marginVertical: width * 0.05,
  },
});

export default SensorGraph;

