import { getFirestore, addDoc, collection } from 'firebase/firestore'; // Ensure correct imports
import { db } from '../config/firebaseConfig'; // Firestore configuration
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
const DummySensor = () => {
  const [temperature, setTemperature] = useState<string>('0');
  const [humidity, setHumidity] = useState<string>('0');

  // Function to generate random values
  const generateSensorData = () => {
    const temp = Math.random() * (35 - 20) + 20; // Random temperature between 20-35°C
    const hum = Math.random() * (100 - 30) + 30; // Random humidity between 30-100%
    setTemperature(temp.toFixed(2));
    setHumidity(hum.toFixed(2));

    // Store the values in Firestore
    addDoc(collection(db, "sensorData"), {
      temperature: temp,
      humidity: hum,
      timestamp: new Date(),
    }).then(() => {
      console.log("Data added to Firestore");
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  };

  // Simulate new data every 5 seconds
  useEffect(() => {
    const interval = setInterval(generateSensorData, 5000); // 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <View>
      <Text>Temperature: {temperature}°C</Text>
      <Text>Humidity: {humidity}%</Text>
    </View>
  );
};

export default DummySensor;
