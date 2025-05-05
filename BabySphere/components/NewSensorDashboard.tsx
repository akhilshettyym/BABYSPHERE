"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import type { SensorData } from "../types/SensorData"

interface NewSensorDashboardProps {
  data: SensorData[]
  isDarkMode: boolean
}

const NewSensorDashboard: React.FC<NewSensorDashboardProps> = ({ data, isDarkMode }) => {
  const [selectedSensor, setSelectedSensor] = useState<keyof SensorData | null>(null)
  const [chartData, setChartData] = useState<number[]>([])
  const [chartLabels, setChartLabels] = useState<string[]>([])

  useEffect(() => {
    if (selectedSensor && data.length > 0) {
      const latestData = data.slice(-10) // Last 10 data points
      setChartData(latestData.map((item) => Number(item[selectedSensor]) || 0))
      setChartLabels(
        latestData.map((item) =>
          new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ),
      )
    }
  }, [selectedSensor, data])

  const latestData = data[data.length - 1] || {}

  const renderSensorCard = (
    title: string,
    value: number | string,
    unit: string,
    icon: string,
    key: keyof SensorData,
  ) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => setSelectedSensor(key)}
      accessibilityLabel={`${title}: ${value} ${unit}`}
      accessibilityHint={`Tap to view ${title} chart`}
    >
      <Ionicons name={icon as any} size={28} color="#FF9500" />
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorValue}>
        {typeof value === "number" ? value.toFixed(1) : value} <Text style={styles.sensorUnit}>{unit}</Text>
      </Text>
    </TouchableOpacity>
  )

  const renderGraph = () => {
    if (!selectedSensor || chartData.length === 0) return null

    const sensorName = selectedSensor as string

    return (
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>{sensorName.charAt(0).toUpperCase() + sensorName.slice(1)}</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }],
            }}
            width={Dimensions.get("window").width - 70}
            height={220}
            chartConfig={{
              backgroundColor: "#242535",
              backgroundGradientFrom: "#242535",
              backgroundGradientTo: "#242535",
              decimalPlaces: selectedSensor === "temperature" ? 1 : 0,
              color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#FF9500",
              },
            }}
            withVerticalLabels={false}
            bezier
            style={styles.chart}
          />
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedSensor(null)}
          accessibilityLabel="Close chart"
        >
          <Ionicons name="close" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.sensorGrid}>
        {renderSensorCard("Temperature", latestData.baby_temperature || 0, "°C", "thermometer", "temperature")}
        {renderSensorCard("SpO2", latestData.spo2 || 0, "%", "pulse", "spo2")}
        {renderSensorCard("Heart Rate", latestData.heartRate || 0, "bpm", "heart", "heartRate")}
        {renderSensorCard("Humidity", latestData.humidity || 0, "%", "water", "humidity")}
      </View>
      {renderGraph()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  sensorCard: {
    width: "48%",
    backgroundColor: "#242535",
    borderRadius: 10,
    padding: 20, // Increased padding for bigger cards
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#2A2A35",
    height: 140, // Fixed height for consistency
  },
  sensorTitle: {
    fontSize: 16, // Increased font size
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
  },
  sensorValue: {
    fontSize: 28, // Increased font size
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
  },
  sensorUnit: {
    fontSize: 16, // Increased font size
    color: "rgba(255, 255, 255, 0.7)",
  },
  graphContainer: {
    backgroundColor: "#242535",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default NewSensorDashboard