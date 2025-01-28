import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

// Screen dimensions for responsive chart sizing
const screenWidth = Dimensions.get('window').width;

const App = () => {
  const [data, setData] = useState({
    heartRate: [78, 80, 75, 82, 70],
    temperature: [36.5, 36.7, 37.0, 38.0, 36.8],
    spo2: [98, 97, 95, 94, 92],
  });

  // Thresholds
  const thresholds = {
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    spo2: { min: 90 },
  };

  const playAlarm = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm.mp3'), // Replace with your alarm sound file
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync(); // Unload sound after playing
        }
      });
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  };

  const checkThresholds = async (param, value) => {
    const { min, max } = thresholds[param] || {};

    if ((min && value < min) || (max && value > max)) {
      const alertMessage = `Urgent: Baby's ${param.toUpperCase()} is ${value} which is ${
        value < min ? 'below' : 'above'
      } the safe range. Please check immediately.`;

      // Play alarm sound
      await playAlarm();

      // Push notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Baby Health Alert',
          body: alertMessage,
          sound: true, // Enables default notification sound
        },
        trigger: null, // Trigger immediately
      });

      // In-app alert
      Alert.alert('Health Alert', alertMessage);
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const notificationResponse = await Notifications.requestPermissionsAsync();
      const audioResponse = await Audio.requestPermissionsAsync();

      if (
        notificationResponse.status !== 'granted' ||
        audioResponse.status !== 'granted'
      ) {
        Alert.alert('Permissions Required', 'Notifications and audio permissions are required!');
      }
    };

    requestPermissions();

    // Simulate real-time data updates every 5 seconds
    const interval = setInterval(() => {
      setData((prevData) => {
        const newHeartRate = Math.floor(Math.random() * (120 - 50) + 50);
        const newTemperature = parseFloat((Math.random() * (38.5 - 35) + 35).toFixed(1));
        const newSpO2 = Math.floor(Math.random() * (100 - 85) + 85);

        // Check thresholds for each parameter
        checkThresholds('heartRate', newHeartRate);
        checkThresholds('temperature', newTemperature);
        checkThresholds('spo2', newSpO2);

        return {
          heartRate: [...prevData.heartRate.slice(-4), newHeartRate],
          temperature: [...prevData.temperature.slice(-4), newTemperature],
          spo2: [...prevData.spo2.slice(-4), newSpO2],
        };
      });
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Baby Health Monitor</Text>

      {/* Heart Rate */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Heart Rate</Text>
        <LineChart
          data={{
            labels: data.heartRate.map((_, i) => `T${i + 1}`),
            datasets: [{ data: data.heartRate }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
        />
        <Text style={styles.threshold}>
          Safe Range: {thresholds.heartRate.min} - {thresholds.heartRate.max} bpm
        </Text>
      </View>

      {/* Body Temperature */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Body Temperature</Text>
        <LineChart
          data={{
            labels: data.temperature.map((_, i) => `T${i + 1}`),
            datasets: [{ data: data.temperature }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
        />
        <Text style={styles.threshold}>
          Safe Range: {thresholds.temperature.min} - {thresholds.temperature.max}°C
        </Text>
      </View>

      {/* SpO2 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>SpO2</Text>
        <LineChart
          data={{
            labels: data.spo2.map((_, i) => `T${i + 1}`),
            datasets: [{ data: data.spo2 }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
        />
        <Text style={styles.threshold}>Safe Range: {thresholds.spo2.min}% and above</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  threshold: { marginTop: 10, fontSize: 14, color: '#555' },
});

export default App;
