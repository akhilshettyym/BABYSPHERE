import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import LiveParameters from './LiveParameters';
import SensorDataFetcher from './SensorDataFetcher';
import { SensorData } from '../types/SensorData';

const LiveFeed: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [frame, setFrame] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  useEffect(() => {
    // Connect to Raspberry Pi's WebSocket server
    websocketRef.current = new WebSocket('ws://192.168.113.120:8000'); // Replace with your Pi's IP

    websocketRef.current.onmessage = (event) => {
      // Convert received binary data to a base64 string
      const binaryData = event.data as ArrayBuffer;
      const base64String = `data:image/jpeg;base64,${Buffer.from(binaryData).toString('base64')}`;
      setFrame(base64String);
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      websocketRef.current?.close();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SensorDataFetcher setSensorData={setSensorData} />
      <View style={styles.header}>
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>Live</Text>
          <View style={styles.redDot} />
        </View>
      </View>
      {frame ? (
        <Image source={{ uri: frame }} style={styles.videoFrame} />
      ) : (
        <Text style={styles.loadingText}>Loading video...</Text>
      )}
      <LiveParameters latestData={latestData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    color: '#8AA9B8',
    fontWeight: 'bold',
    marginRight: 5,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FDC1C5',
  },
  videoFrame: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LiveFeed;
