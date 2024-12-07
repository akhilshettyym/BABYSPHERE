import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NewHeader from '../../components/NewHeader';
import NewSensorDashboard from '../../components/NewSensorDashboard';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { SensorData } from '../../types/SensorData';

const HomePage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'sensor_data'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ambient_temperature: parseFloat(data.ambient_temperature) || 0,
          baby_temperature: parseFloat(data.object_temperature) || 0,
          humidity: parseFloat(data.humidity) || 0,
          spo2: parseFloat(data.spo2) || 0,
          heartRate: parseFloat(data.heartRate || data.heart_rate) || 0,
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      });
      setSensorData(newData.reverse());
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NewHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
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

