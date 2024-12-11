import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NewHeader from '../../components/NewHeader';
import NewSensorDashboard from '../../components/NewSensorDashboard';
import DatePicker from '../../components/DatePicker';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { SensorData } from '../../types/SensorData';

const HomePage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchData = useCallback((date: Date) => {
    setIsLoading(true);
    setError(null);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'sensor_data'),
      where('timestamp', '>=', startOfDay),
      where('timestamp', '<=', endOfDay),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ambient_temperature: parseFloat(data.ambient_temperature) || 0,
            temperature: parseFloat(data.object_temperature) || 0,
            humidity: parseFloat(data.humidity) || 0,
            spo2: parseFloat(data.spo2) || 0,
            heartRate: parseFloat(data.heartRate || data.heart_rate) || 0,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        });
        setSensorData(newData.reverse());
        setIsLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data. Please try again.");
        setIsLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData(selectedDate);
    return () => unsubscribe();
  }, [fetchData, selectedDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(selectedDate);
  }, [fetchData, selectedDate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <NewHeader />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, isDarkMode && styles.darkContent]}>
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#8AA9B8" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <NewSensorDashboard data={sensorData} isDarkMode={isDarkMode} />
          )}
          <TouchableOpacity style={styles.alertButton}>
            <Ionicons name="notifications" size={24} color="#8AA9B8" />
            <Text style={styles.alertButtonText}>View Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#8AA9B8" />
            <Text style={styles.darkModeButtonText}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Text>
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
  darkContainer: {
    backgroundColor: '#1E1E1E',
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
  darkContent: {
    backgroundColor: '#121212',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  darkModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  darkModeButtonText: {
    color: '#8AA9B8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomePage;

