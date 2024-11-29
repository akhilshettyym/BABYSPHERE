import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import SensorDataFetcher from '../../components/SensorDataFetcher';
import { SensorData } from '../../types/SensorData';

const { width } = Dimensions.get('window');

const BabyMonitorGraphPage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('hourly');
  const [selectedGraph, setSelectedGraph] = useState<string>('line');
  const [selectedParameter, setSelectedParameter] = useState<string>('baby_temperature');

  const timeframes = ['hourly', 'daily', 'weekly'];
  const graphTypes = ['line', 'bar'];
  const parameters = [
    { key: 'baby_temperature', label: 'Temperature', unit: '°C' },
    { key: 'spo2', label: 'SpO2', unit: '%' },
    { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
  ];

  // Format data for graph
  const formatData = (data: SensorData[]) => {
    return data.map((item) => {
      let value: number;
      switch (selectedParameter) {
        case 'baby_temperature':
          value = parseFloat(item.baby_temperature.toFixed(1));
          break;
        case 'spo2':
          value = item.spo2;
          break;
        case 'heart_rate':
          value = item.heartRate;
          break;
        default:
          value = 0;
      }

      return {
        value: isNaN(value) ? 0 : value,
        label: new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });
  };

  // Render graph with enhancements
  const renderGraph = () => {
    const chartData = formatData(sensorData).slice(-10); // Use last 10 data points for better visibility
    const values = chartData.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const getYAxisConfig = () => {
      switch (selectedParameter) {
        case 'baby_temperature':
          return { 
            min: Math.max(35, Math.floor(minValue - 0.5)), 
            max: Math.min(42, Math.ceil(maxValue + 0.5))
          };
        case 'spo2':
          return { min: 80, max: 100 };
        case 'heart_rate':
          return { min: Math.max(0, Math.floor(minValue - 10)), max: Math.ceil(maxValue + 10) };
        default:
          return { min: Math.floor(minValue), max: Math.ceil(maxValue) };
      }
    };

    const yAxisConfig = getYAxisConfig();

    const commonProps = {
      data: {
        labels: chartData.map((item) => item.label),
        datasets: [{ data: chartData.map((item) => item.value) }],
      },
      width: width - 32,
      height: 260,
      yAxisLabel: "",
      yAxisSuffix: "",
      chartConfig: {
        backgroundColor: '#F8F9FA',
        backgroundGradientFrom: '#F8F9FA',
        backgroundGradientTo: '#F8F9FA',
        decimalPlaces: selectedParameter === 'baby_temperature' ? 1 : 0,
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
        propsForBackgroundLines: {
          strokeDasharray: '', // Smooth background lines
        },
        yAxisInterval: 1,
        min: yAxisConfig.min,
        max: yAxisConfig.max,
      },
      bezier: true, // Smooth line chart
    };

    return (
      <View>
        {selectedGraph === 'line' ? (
          <LineChart {...commonProps} />
        ) : (
          <BarChart {...commonProps} />
        )}
        {/* Adding X and Y axis labels */}
        <View style={styles.axisLabels}>
          <Text style={styles.yAxisLabel}>Value ({parameters.find(param => param.key === selectedParameter)?.unit})</Text>
          <Text style={styles.xAxisLabel}>Time</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SensorDataFetcher setSensorData={setSensorData} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8AA9B8" />
        </TouchableOpacity>
        <Text style={styles.title}>Baby Monitor Graphs</Text>
      </View>

      {/* Timeframe and Graph Type Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Timeframe:</Text>
          <View style={styles.buttonGroup}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.button,
                  selectedTimeframe === timeframe && styles.selectedButton,
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.buttonText,
                  selectedTimeframe === timeframe && styles.selectedButtonText,
                ]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Graph Type:</Text>
          <View style={styles.buttonGroup}>
            {graphTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.button,
                  selectedGraph === type && styles.selectedButton,
                ]}
                onPress={() => setSelectedGraph(type)}
              >
                <Text style={[
                  styles.buttonText,
                  selectedGraph === type && styles.selectedButtonText,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Graph Rendering */}
      <View style={styles.graphContainer}>
        {renderGraph()}
      </View>

      {/* Parameter Selection */}
      <View style={styles.parameterContainer}>
        {parameters.map((param) => (
          <TouchableOpacity
            key={param.key}
            style={[
              styles.parameterButton,
              selectedParameter === param.key && styles.selectedParameterButton,
            ]}
            onPress={() => setSelectedParameter(param.key)}
          >
            <Text style={[
              styles.parameterButtonText,
              selectedParameter === param.key && styles.selectedParameterButtonText,
            ]}>
              {param.label}
            </Text>
            <Text style={styles.parameterUnit}>{param.unit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8AA9B8',
  },
  controlsContainer: {
    padding: 16,
  },
  controlGroup: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FDC1C5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: '#8AA9B8',
  },
  buttonText: {
    color: '#8AA9B8',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  graphContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  axisLabels: {
    position: 'relative',
    alignItems: 'center',
    marginTop: -20,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#8AA9B8',
    marginTop: 8,
  },
  yAxisLabel: {
    position: 'absolute',
    left: -40,
    top: 100,
    transform: [{ rotate: '270deg' }],
    fontSize: 12,
    color: '#8AA9B8',
  },
  parameterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  parameterButton: {
    backgroundColor: '#FDC1C5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedParameterButton: {
    backgroundColor: '#8AA9B8',
  },
  parameterButtonText: {
    color: '#8AA9B8',
    fontWeight: 'bold',
  },
  selectedParameterButtonText: {
    color: '#FFFFFF',
  },
  parameterUnit: {
    color: '#8AA9B8',
    fontSize: 12,
  },
});

export default BabyMonitorGraphPage;

