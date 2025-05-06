"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native"
import { LineChart, BarChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"
import SensorDataFetcher from "../../components/SensorDataFetcher"
import DatePicker from "../../components/DatePicker"
import type { SensorData } from "../../types/SensorData"
import ViewShot from "react-native-view-shot"
import * as Sharing from "expo-sharing"

const { width } = Dimensions.get("window")

const BabyMonitorGraphPage: React.FC = () => {
  const numSlicedDataPoints = 5
  const graphRef = useRef<ViewShot | null>(null)

  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("hourly")
  const [selectedGraph, setSelectedGraph] = useState("line")
  const [selectedParameter, setSelectedParameter] = useState("baby_temperature")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const timeframes = ["hourly", "daily", "weekly"]
  const graphTypes = ["line", "bar"]
  const parameters = [
    { key: "baby_temperature", label: "Temperature", unit: "°C" },
    { key: "spo2", label: "SpO2", unit: "%" },
    { key: "heart_rate", label: "Heart Rate", unit: "bpm" },
  ]

  useEffect(() => {
    if (sensorData.length > 0) {
      renderGraph()
    }
  }, [sensorData, selectedTimeframe, selectedGraph, selectedParameter, selectedDate])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    SensorDataFetcher({
      setSensorData,
      selectedDate,
      setIsLoading,
      setError,
    })
    setRefreshing(false)
  }, [selectedDate])

  const captureAndShareGraph = async () => {
    try {
      if (graphRef.current?.capture) {
        const uri = await graphRef.current.capture()
        if (uri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Share Graph",
            UTI: "public.png",
          })
        } else {
          console.error("Sharing is not available on this platform.")
        }
      } else {
        console.error("Graph reference is undefined or capture method is not available.")
      }
    } catch (error) {
      console.error("Error sharing graph:", error)
    }
  }

  function getFormattedValue(item: SensorData) {
    let value: number
    switch (selectedParameter) {
      case "baby_temperature":
        value = Number.parseFloat(item.baby_temperature.toFixed(1))
        break
      case "spo2":
        value = item.spo2
        break
      case "heart_rate":
        value = item.heartRate
        break
      default:
        value = 0
    }

    return {
      value: isNaN(value) ? 0 : value,
      label: item.timestamp.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
    }
  }

  function leftFillNum(num: number, targetLength: number) {
    return num.toString().padStart(targetLength, "0")
  }

  function getWeekDifference(timestamp1: number, timestamp2: number) {
    const diffInMs = Math.abs(timestamp2 - timestamp1)
    const msPerWeek = 1000 * 60 * 60 * 24 * 7
    return Math.ceil(diffInMs / msPerWeek)
  }

  function getWeekNumber(d: Date) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const weekNum = getWeekDifference(d.valueOf(), yearStart.valueOf())
    return d.getFullYear() + "-W" + leftFillNum(weekNum, 2)
  }

  const calcReqAvg = (
    daily_or_weekly: "daily" | "weekly",
    ds: SensorData[],
    selectedParameter: string
  ) => {
    const acc = new Map()
    ds.forEach((cur: SensorData) => {
      const key =
        daily_or_weekly === "daily"
          ? cur.timestamp.getDate() +
            "/" +
            (cur.timestamp.getMonth() + 1) +
            "/" +
            cur.timestamp.getFullYear()
          : getWeekNumber(cur.timestamp)

      const a: any = {
        value: getFormattedValue(cur).value,
        count: 1,
      }
      if (acc.get(key)) {
        a.value = a.value + Number.parseFloat(acc.get(key).value)
        a.count = Number.parseInt(acc.get(key).count) + 1
      }
      acc.set(key, a)
    })

    const reqAverage: any[] = []
    acc.forEach((value, key) => {
      reqAverage.push({
        value: value.value / value.count,
        label: key,
      })
    })
    return reqAverage
  }

  const cleanseData = (
    sensorData: SensorData[],
    selectedTimeframe: string,
    selectedParameter: string
  ) => {
    sensorData = sensorData.filter((data) => {
      switch (selectedParameter) {
        case "baby_temperature":
          return data.baby_temperature > 0
        case "spo2":
          return data.spo2 > 0
        case "heart_rate":
          return data.heartRate > 0
        default:
          return data
      }
    })

    if (selectedTimeframe === "daily" || selectedTimeframe === "weekly") {
      return calcReqAvg(selectedTimeframe, sensorData, selectedParameter)
    }

    return sensorData.map((cur: SensorData) => getFormattedValue(cur))
  }

  const renderGraph = () => {
    if (sensorData.length === 0) return null

    const cleansedData = cleanseData(sensorData, selectedTimeframe, selectedParameter)
    const chartData = cleansedData.slice(-numSlicedDataPoints).reverse()
    const values = chartData.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    const getYAxisConfig = () => {
      switch (selectedParameter) {
        case "baby_temperature":
          return {
            min: Math.max(28, Math.floor(minValue - 0.5)),
            max: Math.min(42, Math.ceil(maxValue + 0.5)),
          }
        case "spo2":
          return { min: 80, max: 100 }
        case "heart_rate":
          return {
            min: Math.max(0, Math.floor(minValue - 10)),
            max: Math.ceil(maxValue + 10),
          }
        default:
          return {
            min: Math.floor(minValue),
            max: Math.ceil(maxValue),
          }
      }
    }

    const yAxisConfig = getYAxisConfig()

    const commonProps = {
      data: {
        labels: chartData.map((item) => item.label),
        datasets: [{ data: chartData.map((item) => item.value) }],
      },
      width: width - 32,
      height: 260,
      yAxisLabel: parameters.find((param) => param.key === selectedParameter)?.unit || "",
      chartConfig: {
        backgroundColor: "#242535",
        backgroundGradientFrom: "#242535",
        backgroundGradientTo: "#242535",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: "6", strokeWidth: "2", stroke: "#FF9500" },
        propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(255, 255, 255, 0.1)" },
      },
      bezier: true,
      yAxisInterval: 1,
      min: yAxisConfig.min,
      max: yAxisConfig.max,
      yAxisLabelRotation: 270,
      yAxisSuffix: parameters.find((param) => param.key === selectedParameter)?.unit || "",
    };
    

    return (
      <ViewShot ref={graphRef} options={{ format: "png", quality: 0.9 }}>
        <View>
          {selectedGraph === "line" ? <LineChart {...commonProps} /> : <BarChart {...commonProps} />}
          <Text style={styles.xAxisLabel}>Time</Text>
        </View>
      </ViewShot>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <SensorDataFetcher
        setSensorData={setSensorData}
        selectedDate={selectedDate}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
        </TouchableOpacity>
        <Text style={styles.title}>BABY MONITOR GRAPH</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </View>

      <View style={styles.controlsWrapper}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Timeframe</Text>
          <View style={styles.controlButtonGroup}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.controlButton,
                  selectedTimeframe === timeframe && styles.controlButtonSelected,
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    selectedTimeframe === timeframe && styles.controlButtonTextSelected,
                  ]}
                >
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Graph Type</Text>
          <View style={styles.controlButtonGroup}>
            {graphTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.controlButton,
                  selectedGraph === type && styles.controlButtonSelected,
                ]}
                onPress={() => setSelectedGraph(type)}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    selectedGraph === type && styles.controlButtonTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.graphContainer}>
        {renderGraph()}
        <TouchableOpacity style={styles.downloadButton} onPress={captureAndShareGraph}>
          <Ionicons name="download-outline" size={24} color="#FFFFFF" />
          <Text style={styles.downloadButtonText}>Download Graph</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parameterContainer}>
        {parameters.map((param) => (
          <TouchableOpacity
            key={param.key}
            style={[
              styles.parameterButton,
              selectedParameter === param.key && styles.selectedParameterButton,
            ]}
            onPress={() => setSelectedParameter(param.key)}
          >
            <Text
              style={[
                styles.parameterButtonText,
                selectedParameter === param.key && styles.selectedParameterButtonText,
              ]}
            >
              {param.label}
            </Text>
            <Text style={styles.parameterUnit}>{param.unit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
  },
  backButton: {
    marginRight: 16,
  },
  datePickerContainer: {
    padding: 16,
    backgroundColor: "#242535",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  controlsWrapper: {
    padding: 16,
    backgroundColor: "#242535",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  controlGroup: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  controlButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A35",
    backgroundColor: "#1A1A25",
    alignItems: "center",
  },
  controlButtonSelected: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  controlButtonTextSelected: {
    color: "#FFFFFF",
  },
  graphContainer: {
    padding: 16,
    backgroundColor: "#242535",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },
  parameterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  parameterButton: {
    backgroundColor: "#242535",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  selectedParameterButton: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  parameterButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  selectedParameterButtonText: {
    color: "#FFFFFF",
  },
  parameterUnit: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default BabyMonitorGraphPage