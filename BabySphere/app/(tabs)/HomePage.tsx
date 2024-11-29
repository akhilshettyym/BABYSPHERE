import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NewHeader from '../../components/NewHeader';
import NewSensorDashboard from '../../components/NewSensorDashboard';
import SensorDataFetcher from '../../components/SensorDataFetcher';
import { SensorData } from '../../types/SensorData';

const HomePage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <NewHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <SensorDataFetcher setSensorData={setSensorData} />
          <NewSensorDashboard data={sensorData} />
          <TouchableOpacity style={styles.alertButton}>
            <Ionicons name="notifications" size={24} color="#8AA9B8" />
            <Text style={styles.alertButtonText}>View Alerts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3D8F4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1C1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  alertButtonText: {
    color: '#8AA9B8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomePage;

