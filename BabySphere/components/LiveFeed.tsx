import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import VideoPlayer from './VideoPlayer';
import LiveParameters from './LiveParameters';
import SensorDataFetcher from './SensorDataFetcher';
import { SensorData } from '../types/SensorData';

const LiveFeed: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  return (
    <SafeAreaView style={styles.container}>
      <SensorDataFetcher setSensorData={setSensorData} />
      <View style={styles.header}>
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>Live</Text>
          <View style={styles.redDot} />
        </View>
      </View>
      <VideoPlayer uri="https://example.com/baby-monitor-stream" />
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
});

export default LiveFeed;

