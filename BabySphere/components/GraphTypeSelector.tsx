import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface GraphTypeSelectorProps {
  onSwitch: () => void;
  currentType: string;
}

const GraphTypeSelector: React.FC<GraphTypeSelectorProps> = ({ onSwitch, currentType }) => {
  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <Text style={styles.typeText}>Switch Graph Type</Text>
        <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
          <RefreshCw size={20} color="#718096" />
        </TouchableOpacity>
      </View>
      <View style={styles.currentType}>
        <Text style={styles.currentTypeText}>Baby</Text>
        <Text style={styles.currentValueText}>80°C</Text>
        <Text style={styles.statusText}>currently</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  switchButton: {
    padding: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
  },
  currentType: {
    backgroundColor: '#B4E3A7',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  currentValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  statusText: {
    fontSize: 14,
    color: '#4A5568',
  },
});

export default GraphTypeSelector;

