import React, { useState } from 'react';
import { View, Modal, StyleSheet ,Text,TouchableOpacity } from 'react-native';
import SensorGraph from './SensorGraph';
import { SensorData } from '../types/SensorData';
import SensorDataFetcher from './SensorDataFetcher'; // Import the renamed component
import SensorDashboardUI from './SensorDashboardUI'; // Import UI component

interface SensorDashboardProps {
  data: SensorData[]; // Data will be passed here
}

const SensorDashboard: React.FC<SensorDashboardProps> = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]); // Renamed the state variable

  const latestData = sensorData[sensorData.length - 1] || {}; // Use the renamed state variable

  const openModal = (sensor: string) => {
    setSelectedSensor(sensor);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSensor(null);
  };

  return (
    <View style={styles.container}>
      <SensorDataFetcher setSensorData={setSensorData} />  {/* Now passing setSensorData */}

      {/* Render the UI component with latest data and openModal function */}
      <SensorDashboardUI latestData={latestData} openModal={openModal} />
      <Text></Text>

      {/* Modal for showing Sensor Graph */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}><Text></Text>
          <View style={styles.modalContent}>
            <SensorGraph data={sensorData} selectedSensor={selectedSensor} />  {/* Pass the renamed state variable */}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333', // Dark background for contrast
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SensorDashboard;
