import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { SensorData } from "../types/SensorData"

interface LiveParametersProps {
  latestData: SensorData | null
}

const LiveParameters: React.FC<LiveParametersProps> = ({ latestData }) => {
  const isAbnormal = (value: number, min: number, max: number) => value < min || value > max

  if (!latestData) {
    return <Text style={styles.loadingText}>Loading sensor data...</Text>
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.parameter, isAbnormal(latestData.baby_temperature, 36, 37.5) && styles.abnormalParameter]}>
        Baby Temperature: {latestData.baby_temperature.toFixed(1)}°C
      </Text>
      <Text style={[styles.parameter, isAbnormal(latestData.ambient_temperature, 18, 24) && styles.abnormalParameter]}>
        Room Temperature: {latestData.ambient_temperature.toFixed(1)}°C
      </Text>
      <Text style={[styles.parameter, isAbnormal(latestData.humidity, 30, 60) && styles.abnormalParameter]}>
        Humidity: {latestData.humidity.toFixed(0)}%
      </Text>
      <Text style={[styles.parameter, isAbnormal(latestData.spo2, 95, 100) && styles.abnormalParameter]}>
        SpO2: {latestData.spo2.toFixed(0)}%
      </Text>
      <Text style={[styles.parameter, isAbnormal(latestData.heartRate, 60, 160) && styles.abnormalParameter]}>
        Heart Rate: {latestData.heartRate.toFixed(0)} bpm
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242535",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  parameter: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
  },
  abnormalParameter: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
})

export default LiveParameters