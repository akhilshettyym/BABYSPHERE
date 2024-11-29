import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SensorLegend: React.FC = () => {
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#B4E3A7' }]} />
        <Text style={styles.legendText}>Normal</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#FFF1C1' }]} />
        <Text style={styles.legendText}>Warning</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#FDC1C5' }]} />
        <Text style={styles.legendText}>Alert</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: width * 0.05,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    marginRight: width * 0.02,
  },
  legendText: {
    color: '#8AA9B8',
    fontSize: width * 0.035,
  },
});

export default SensorLegend;

