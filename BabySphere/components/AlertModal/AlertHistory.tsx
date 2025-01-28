import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Alert } from '../../types/AlertTypes';

interface AlertHistoryProps {
  alerts: Alert[];
  isDarkMode: boolean;
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts, isDarkMode }) => {
  return (
    <ScrollView style={styles.container}>
      {alerts.map((alert) => (
        <View 
          key={alert.id} 
          style={[
            styles.alertItem,
            isDarkMode && styles.darkAlertItem
          ]}
        >
          <Text style={[styles.timestamp, isDarkMode && styles.darkText]}>
            {new Date(alert.timestamp).toLocaleString()}
          </Text>
          <Text style={[styles.message, isDarkMode && styles.darkText]}>
            {alert.message}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertItem: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  darkAlertItem: {
    backgroundColor: '#2A2A2A',
  },
  timestamp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  darkText: {
    color: '#E0E0E0',
  },
});