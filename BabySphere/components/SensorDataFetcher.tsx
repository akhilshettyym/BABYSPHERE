import React, { useEffect } from 'react';
import { View } from 'react-native';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SensorData } from '../types/SensorData';

interface SensorDataFetcherProps {
  setSensorData: React.Dispatch<React.SetStateAction<SensorData[]>>;
  selectedDate: Date;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SensorDataFetcher: React.FC<SensorDataFetcherProps> = ({
  setSensorData,
  selectedDate,
  setIsLoading,
  setError
}) => {
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'all_sensor_data'),
      where('timestamp', '>=', startOfDay),
      where('timestamp', '<=', endOfDay),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
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
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setSensorData, selectedDate, setIsLoading, setError]);

  return null;
};

export default SensorDataFetcher;

