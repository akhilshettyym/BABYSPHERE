import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import LiveParameters from './LiveParameters';
import SensorDataFetcher from './SensorDataFetcher';
import { SensorData } from '../types/SensorData';

const LiveFeed: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  const cameraFeedUri = "http://192.168.40.162:5002/processed_feed"; // Replace with your live stream URL

  return (
    <SafeAreaView style={styles.container}>
      <SensorDataFetcher 
        setSensorData={setSensorData}
        selectedDate={selectedDate}
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <View style={styles.header}>
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>Live</Text>
          <View style={styles.redDot} />
        </View>
      </View>

      {/* Live Stream Component */}
      {Platform.OS === 'web' ? (
        <iframe 
          src={cameraFeedUri} 
          style={styles.iframe} 
          title="Live Stream" 
        />
      ) : (
        <View style={styles.webViewContainer}>
          <WebView 
            source={{ uri: cameraFeedUri }} 
            style={styles.webView} 
            onError={() => setError("")}
          />
        </View>
      )}

      <LiveParameters latestData={latestData} />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  iframe: {
    width: '100%',
    height: 300, //adjust as needed
  },
  webViewContainer: {
    flex: 1,
    height: 300, // Adjust as needed
    marginTop: 10,
  },
  webView: {
    flex: 1,
  },
});

export default LiveFeed;