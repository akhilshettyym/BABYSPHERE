import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Thermometer, Heart, Activity, Droplets, Wind, Sun, Moon, Settings } from 'lucide-react-native';

const BottomNavigation: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.iconContainer}>
          <Thermometer size={24} color="#2D3748" />
        </View>
        <Text style={styles.navText}>Core Temperature</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.iconContainer}>
          <Heart size={24} color="#2D3748" />
        </View>
        <Text style={styles.navText}>Heart Rate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.iconContainer}>
          <Activity size={24} color="#2D3748" />
        </View>
        <Text style={styles.navText}>SpO2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.iconContainer}>
          <Droplets size={24} color="#2D3748" />
        </View>
        <Text style={styles.navText}>Humidity</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#4A5568',
    textAlign: 'center',
  },
});

export default BottomNavigation;

