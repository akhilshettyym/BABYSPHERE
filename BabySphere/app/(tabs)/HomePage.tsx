"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import NewSensorDashboard from "../../components/NewSensorDashboard"
import DatePicker from "../../components/DatePicker"
import SensorDataFetcher from "../../components/SensorDataFetcher"
import { AlertModal } from "../../components/AlertModal/AlertModal"
import { setupNotifications } from "../../utils/notificationUtils"
import { useAlerts } from "../../hooks/useAlertSystem"
import type { SensorData } from "../../types/SensorData"
import { defaultSettings } from "../../types/AlertTypes"

const HomePage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const { alerts, checkThresholds } = useAlerts()

  useEffect(() => {
    if (sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1]
      checkThresholds(latestData, settings)
    }
  }, [sensorData, settings, checkThresholds])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }
  useEffect(() => {
    setupNotifications()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>BABYSPHERE</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          <SensorDataFetcher
            setSensorData={setSensorData}
            selectedDate={selectedDate}
            setIsLoading={setIsLoading}
            setError={setError}
          />
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF9500" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <NewSensorDashboard data={sensorData} isDarkMode={true} />
          )}
          <TouchableOpacity style={styles.alertButton} onPress={() => setShowAlertModal(true)}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <Text style={styles.alertButtonText}>View Alerts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        alerts={alerts}
        settings={settings}
        onUpdateSettings={setSettings}
        isDarkMode={true}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  fixedHeader: {
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "left",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60, // Add padding to account for fixed header
  },
  content: {
    flex: 1,
    backgroundColor: "#1A1A25",
    padding: 24,
    marginHorizontal: 8,
  },
  alertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242535",
    padding: 18,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#FF9500",
    elevation: 3,
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    height: 63,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#2A2A35",
  },
})

export default HomePage