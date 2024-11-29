import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GraphOption, TimeframeOption } from '../types/babyMonitor';

const { width } = Dimensions.get('window');

interface SensorSelectorProps {
  selectedGraph: GraphOption;
  selectedTimeframe: TimeframeOption;
  onGraphChange: (value: GraphOption) => void;
  onTimeframeChange: (value: TimeframeOption) => void;
}

const SensorSelector: React.FC<SensorSelectorProps> = ({
  selectedGraph,
  selectedTimeframe,
  onGraphChange,
  onTimeframeChange,
}) => {
  return (
    <View style={styles.selectorContainer}>
      <Picker
        selectedValue={selectedGraph}
        style={styles.picker}
        onValueChange={(itemValue) => onGraphChange(itemValue as GraphOption)}
      >
        <Picker.Item label="Temperature" value="baby_temperature" />
        <Picker.Item label="Heart Rate" value="heartRate" />
        <Picker.Item label="SpO2" value="spo2" />
        <Picker.Item label="Humidity" value="humidity" />
      </Picker>

      <Picker
        selectedValue={selectedTimeframe}
        style={styles.picker}
        onValueChange={(itemValue) => onTimeframeChange(itemValue as TimeframeOption)}
      >
        <Picker.Item label="Hourly" value="hourly" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'column',
    marginBottom: width * 0.05,
  },
  picker: {
    height: width * 0.12,
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#8AA9B8',
    borderRadius: 8,
    marginBottom: width * 0.025,
  },
});

export default SensorSelector;

