"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from "react-native"
import { WebView } from "react-native-webview"
import LiveParameters from "./LiveParameters"
import SensorDataFetcher from "./SensorDataFetcher"
import type { SensorData } from "../types/SensorData"

const LiveFeed: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null

  const cameraFeedUri = "http://192.168.83.162:5002/processed_feed"

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
      {Platform.OS === "web" ? (
        <iframe src={cameraFeedUri} style={styles.iframe} title="Live Stream" />
      ) : (
        <View style={styles.webViewContainer}>
          <WebView source={{ uri: cameraFeedUri }} style={styles.webView} onError={() => setError("")} />
        </View>
      )}

      <LiveParameters latestData={latestData} />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  )
}

// Update LiveFeed component styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 5,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 10,
  },
  iframe: {
    width: "100%",
    height: 300,
  },
  webViewContainer: {
    flex: 1,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  webView: {
    flex: 1,
  },
})

export default LiveFeed