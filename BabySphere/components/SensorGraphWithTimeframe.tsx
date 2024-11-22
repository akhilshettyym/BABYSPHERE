import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { SensorData } from '../types/SensorData'; // Adjust the path as needed

interface SensorGraphWithTimeframeProps {
  data: SensorData[];
}

const SensorGraphWithTimeframe: React.FC<SensorGraphWithTimeframeProps> = ({ data }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('5s');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);

  // Effect to filter data based on the selected timeframe
  useEffect(() => {
    if (data.length > 0) {
      const now = new Date();
      let filtered: SensorData[] = [];

      switch (selectedTimeframe) {
        case '5s':
          filtered = data.slice(-1); // Latest data
          break;
        case '5m':
          filtered = data.filter((d) => now.getTime() - d.timestamp.getTime() <= 5 * 60 * 1000);
          break;
        case 'hourly':
          filtered = aggregateData(data, 'hour');
          break;
        case 'daily':
          filtered = aggregateData(data, 'day');
          break;
        case 'weekly':
          filtered = aggregateData(data, 'week');
          break;
        default:
          filtered = data;
      }

      setFilteredData(filtered);
    }
  }, [data, selectedTimeframe]);

  // Aggregates data into intervals
  const aggregateData = (data: SensorData[], interval: 'hour' | 'day' | 'week') => {
    const aggregated: SensorData[] = [];
    const intervalMap: { [key: string]: number } = {
      hour: 3600 * 1000,
      day: 24 * 3600 * 1000,
      week: 7 * 24 * 3600 * 1000,
    };
    const intervalMillis = intervalMap[interval];

    let currentBatch: SensorData[] = [];
    let lastTimestamp = data[0].timestamp.getTime();

    for (const entry of data) {
      if (entry.timestamp.getTime() - lastTimestamp <= intervalMillis) {
        currentBatch.push(entry);
      } else {
        if (currentBatch.length > 0) {
          aggregated.push(calculateAggregate(currentBatch));
        }
        currentBatch = [entry];
        lastTimestamp = entry.timestamp.getTime();
      }
    }

    if (currentBatch.length > 0) {
      aggregated.push(calculateAggregate(currentBatch));
    }

    return aggregated;
  };

  // Calculates aggregate values for a batch of data
  const calculateAggregate = (batch: SensorData[]): SensorData => {
    const avg = (key: keyof SensorData) =>
      batch.reduce((acc, curr) => acc + (curr[key] as number), 0) / batch.length;

    return {
      id: batch[0].id,
      temperature: avg('temperature'),
      humidity: avg('humidity'),
      ambient_temperature: avg('ambient_temperature'),
      object_temperature: avg('object_temperature'),
      timestamp: batch[0].timestamp, // Keep the first timestamp
    };
  };

  // Formats timestamp to dd/mm/yyyy or dd/mm/yyyy hh:mm based on context
  const formatTimestamp = (date: Date, format: 'date' | 'datetime') => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
    return format === 'datetime' ? `${day}/${month}/${year} ${time}` : `${day}/${month}/${year}`;
  };

  // Handle data point click
  const handleDataPointClick = (dataPoint: SensorData) => {
    const timestampFormat = selectedTimeframe === 'hourly' ? 'date' : 'datetime';
    Alert.alert(
      'Sensor Data Details',
      `Timestamp: ${formatTimestamp(dataPoint.timestamp, timestampFormat)}\n` +
        `Temperature: ${dataPoint.temperature}°C\n` +
        `Humidity: ${dataPoint.humidity}%\n` +
        `Ambient Temp: ${dataPoint.ambient_temperature}°C\n` +
        `Object Temp: ${dataPoint.object_temperature}°C`
    );
  };

  // Renders the Line Chart
  const renderChart = () => {
    if (filteredData.length === 0)
      return <Text>No data available for the selected timeframe.</Text>;

    const labels = filteredData.map((d) =>
      selectedTimeframe === 'hourly'
        ? `${String(d.timestamp.getHours()).padStart(2, '0')}:00`
        : formatTimestamp(d.timestamp, 'date')
    );
    const values = filteredData.map((d) => d[selectedParameter] || 0);

    return (
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={Dimensions.get('window').width * 0.9}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f8f8f8',
          backgroundGradientTo: '#f8f8f8',
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffffff',
          },
          propsForBackgroundLines: {
            strokeWidth: 0.5,
          },
        }}
        style={styles.chart}
        onDataPointClick={(data) => {
          const clickedData = filteredData[data.index];
          handleDataPointClick(clickedData);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>

      {/* Parameter Selector */}
      <Picker
        selectedValue={selectedParameter}
        style={styles.picker}
        onValueChange={(value) => setSelectedParameter(value)}
      >
        <Picker.Item label="Temperature" value="temperature" />
        <Picker.Item label="Humidity" value="humidity" />
        <Picker.Item label="Ambient Temperature" value="ambient_temperature" />
        <Picker.Item label="Object Temperature" value="object_temperature" />
      </Picker>

      {/* Timeframe Selector */}
      <Picker
        selectedValue={selectedTimeframe}
        style={styles.picker}
        onValueChange={(value) => setSelectedTimeframe(value)}
      >
        <Picker.Item label="Real-time (5s)" value="5s" />
        <Picker.Item label="Last 5 minutes" value="5m" />
        <Picker.Item label="Hourly" value="hourly" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
      </Picker>

      {/* Render the chart */}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  chart: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default SensorGraphWithTimeframe;
