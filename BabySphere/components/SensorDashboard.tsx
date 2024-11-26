import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SensorDataFetcher from './SensorDataFetcher'; // Component to fetch sensor data
import { SensorData } from '../types/SensorData';
import SensorGraphWithTimeframe from './SensorGraphWithTimeframe'; // Component for graphs
import SensorDashboardUI from './SensorDashboardUI';

const SensorDashboard: React.FC<{ data: SensorData[] }> = ({ data }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  // Get the latest data point
  const latestData = sensorData[sensorData.length - 1] || {};

  // Open modal with the selected sensor
  const openModal = (sensor: string) => {
    setSelectedSensor(sensor);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedSensor(null);
  };

  return (
    <View style={styles.container}>
      {/* Fetch and update sensor data */}
      <SensorDataFetcher setSensorData={setSensorData} />
      <SensorDashboardUI latestData={latestData} openModal={openModal} />
      

      
      {/* Modal for displaying sensor graphs */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Render graphs based on the selected sensor */}
            {selectedSensor && (
              <SensorGraphWithTimeframe data={sensorData} sensor={selectedSensor} />
            )}

            {/* Close button */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '45%',
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  boxTitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  boxValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#F87171',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SensorDashboard;
