import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SensorData } from '../types/SensorData';

interface SensorDataFetcherProps {
  setSensorData: React.Dispatch<React.SetStateAction<SensorData[]>>;
}

const SensorDataFetcher: React.FC<SensorDataFetcherProps> = ({ setSensorData }) => {
  useEffect(() => {
    const q = query(collection(db, 'sensor_data'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData: SensorData[] = snapshot.docs.map((doc) => {
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
      

      setSensorData(allData);
    });

    return () => unsubscribe();
  }, [setSensorData]);

  return <View />;
};

export default SensorDataFetcher;
