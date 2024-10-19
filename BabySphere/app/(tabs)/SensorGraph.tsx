import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const SensorGraph = () => {
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [humidityData, setHumidityData] = useState<number[]>([]);

  // Fetch data from Firestore
  useEffect(() => {
    const q = query(collection(db, 'sensorData'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tempData: number[] = [];
      const humData: number[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        tempData.push(data.temperature);
        humData.push(data.humidity);
      });

      setTemperatureData(tempData);
      setHumidityData(humData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <View>
      {/* Temperature Line Chart */}
      <LineChart
        data={{
          labels: temperatureData.map((_, index) => index.toString()), // X-axis
          datasets: [{ data: temperatureData }],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{ marginVertical: 8 }}
      />

      {/* Humidity Line Chart */}
      <LineChart
        data={{
          labels: humidityData.map((_, index) => index.toString()),
          datasets: [{ data: humidityData }],
        }}
        width={Dimensions.get('window').width}
        height={220}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: '#022173',
          backgroundGradientFrom: '#1c4587',
          backgroundGradientTo: '#1e3a8a',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{ marginVertical: 8 }}
      />
    </View>
  );
};

export default SensorGraph;
