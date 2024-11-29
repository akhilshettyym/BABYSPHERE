import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { SensorData } from '../types/SensorData'; // Adjust the path as needed

interface SensorGraphWithTimeframeProps {
  data: SensorData[];
  sensor: string;
}

const SensorGraphWithTimeframe: React.FC<SensorGraphWithTimeframeProps> = ({ data, sensor }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('5s');
  const [selectedParameter, setSelectedParameter] = useState(sensor); // Set based on the passed sensor
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);

  // Update selected parameter whenever the sensor prop changes
// Update selected parameter whenever the sensor prop changes
useEffect(() => {
  if (sensor) {
    setSelectedParameter(sensor); // Sync selectedParameter with sensor
  }
}, [sensor]);


  // Filter data based on the selected timeframe
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

  // Calculate aggregate values for a batch of data
  const calculateAggregate = (batch: SensorData[]): SensorData => {
    const avg = (key: keyof SensorData) =>
      batch.reduce((acc, curr) => acc + (curr[key] as number), 0) / batch.length;

    return {
      id: batch[0].id,
      ambient_temperature: avg('ambient_temperature'),
      baby_temperature: avg('baby_temperature'),
      humidity: avg('humidity'),
      spo2: avg('spo2'),
      heartRate: avg('heartRate'),
      timestamp: batch[0].timestamp,
    };
  };

  // Format timestamp to dd/mm/yyyy or dd/mm/yyyy hh:mm based on context
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
        `Baby Temperature: ${dataPoint.baby_temperature}°C\n` +
        `Humidity: ${dataPoint.humidity}%\n` +
        `Ambient Temperature: ${dataPoint.ambient_temperature}°C\n` +
        `SpO2: ${dataPoint.spo2}%\n` +
        `Heart Rate: ${dataPoint.heartRate} bpm`
    );
  };

  // Render the Line Chart
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
      <Text style={styles.title}>Sensor Data: {selectedParameter}</Text>

      {/* Parameter Selector */}
      <Picker
  selectedValue={selectedParameter}
  style={styles.picker}
  onValueChange={(value) => setSelectedParameter(value)} // Update the parameter on selection
>
  <Picker.Item label="Baby Temperature" value="baby_temperature" />
  <Picker.Item label="Humidity" value="humidity" />
  <Picker.Item label="Ambient Temperature" value="ambient_temperature" />
  <Picker.Item label="SpO2" value="spo2" />
  <Picker.Item label="Heart Rate" value="heartRate" />
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
