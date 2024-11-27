import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { SensorData } from '../types/SensorData';

// Define the possible sensor types as a union type
type SensorType = 'temperature' | 'spO2' | 'heartRate';

// Define the thresholds object type
type ThresholdsType = {
  [key in SensorType]: {
    normal: { range: [number, number]; color: string };
    low: { range: [number, number]; color: string };
    high?: { range: [number, number]; color: string };
    critical?: { range: [number, number]; color: string };
  };
};

// Define thresholds with explicit typing
const thresholds: ThresholdsType = {
  temperature: {
    normal: { range: [36.5, 37.5], color: '#B4E3A7' },
    low: { range: [-Infinity, 36.5], color: '#A3D8F4' },
    high: { range: [37.5, Infinity], color: '#FDC1C5' },
  },
  spO2: {
    normal: { range: [95, 100], color: '#B4E3A7' },
    low: { range: [90, 94], color: '#8AA9B8' },
    critical: { range: [-Infinity, 90], color: '#FDC1C5' },
  },
  heartRate: {
    normal: { range: [100, 160], color: '#B4E3A7' },
    low: { range: [-Infinity, 100], color: '#A3D8F4' },
    high: { range: [160, Infinity], color: '#FDC1C5' },
  },
};

interface SensorGraphProps {
  data: SensorData[];
  selectedSensor: SensorType | null;
}

const SensorGraph: React.FC<SensorGraphProps> = ({ data, selectedSensor }) => {
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);

  if (!selectedSensor || data.length === 0) return null;

  const filterData = () => {
    const labels: string[] = [];
    const values: number[] = [];
    let lastValue = data[0][selectedSensor as keyof SensorData] as number;

    data.forEach((entry, index) => {
      const currentValue = entry[selectedSensor as keyof SensorData] as number | null;
      const timestamp = new Date(entry.timestamp);
      const formattedTimestamp = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

      if (currentValue !== null && currentValue !== undefined) {
        const isSignificantChange =
          Math.abs((currentValue - lastValue) / lastValue) > 0.01 || index === data.length - 1;

        if (isSignificantChange) {
          labels.push(formattedTimestamp);
          values.push(parseFloat(currentValue.toFixed(2)));
          lastValue = currentValue;
        }
      }
    });

    return { labels, values };
  };

  const { labels, values } = filterData();

  const getLineColor = () => {
    const parameterThresholds = thresholds[selectedSensor as keyof typeof thresholds];
    if (!parameterThresholds) return '#B4E3A7'; // Default to Pale Mint Green if no thresholds

    const lastValue = values[values.length - 1];
    for (const key in parameterThresholds) {
      const threshold = parameterThresholds[key as keyof typeof parameterThresholds];
      if (threshold && lastValue >= threshold.range[0] && lastValue <= threshold.range[1]) {
        return threshold.color;
      }
    }

    return '#B4E3A7'; // Default color
  };

  const handleDataPointClick = (data: { index: number }) => {
    const clickedIndex = data.index;
    if (clickedIndex !== undefined) {
      setSelectedTimestamp(labels[clickedIndex]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSensor} Over Time</Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={Dimensions.get('window').width * 0.9}
        height={220}
        chartConfig={{
          backgroundColor: '#F8F9FA',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 2,
          color: () => getLineColor(),
          labelColor: () => '#333333',
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#FFFFFF',
          },
          strokeWidth: 2,
        }}
        style={styles.chart}
        onDataPointClick={handleDataPointClick}
      />

      {selectedTimestamp && (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>Timestamp: {selectedTimestamp}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
  timestampContainer: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  timestampText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default SensorGraph;
