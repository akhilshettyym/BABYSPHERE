import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SensorData } from '../types/SensorData';

interface DummySensorProps {
  setSensorData: React.Dispatch<React.SetStateAction<SensorData[]>>;
}

const DummySensor: React.FC<DummySensorProps> = ({ setSensorData }) => {
  const [temperature, setTemperature] = useState<string>('0');
  const [humidity, setHumidity] = useState<string>('0');

  useEffect(() => {
    try {
      const q = query(collection(db, 'sensor_data'), orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allData: SensorData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ambient_temperature: data.ambient_temperature,
            object_temperature: data.object_temperature,
            temperature: data.temperature,
            humidity: data.humidity,
            timestamp: data.timestamp.toDate(),
          };
        });

        setSensorData(allData);

        if (allData.length > 0) {
          const latestData = allData[allData.length - 1];
          setTemperature(latestData.temperature.toString());
          setHumidity(latestData.humidity.toString());
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error initializing Firebase listener:', error);
    }
  }, [setSensorData]);

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default DummySensor;
