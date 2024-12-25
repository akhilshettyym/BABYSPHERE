import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NewHeader from '../../components/NewHeader';
import NewSensorDashboard from '../../components/NewSensorDashboard';
import DatePicker from '../../components/DatePicker';
import SensorDataFetcher from '../../components/SensorDataFetcher';
import { AlertModal } from '../../components/AlertModal/AlertModal';
import { setupNotifications } from '../../utils/notificationUtils';
import { useAlerts } from '../../hooks/useAlertSystem';
import { SensorData } from '../../types/SensorData';
import { defaultSettings } from '../../types/AlertTypes';

const HomePage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const { alerts, checkThresholds } = useAlerts();

  useEffect(() => {
    if (sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1];
      checkThresholds(latestData, settings);
    }
  }, [sensorData, settings, checkThresholds]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <NewHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, isDarkMode && styles.darkContent]}>
          <SensorDataFetcher
            setSensorData={setSensorData}
            selectedDate={selectedDate}
            setIsLoading={setIsLoading}
            setError={setError}
          />
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#8AA9B8" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <NewSensorDashboard data={sensorData} isDarkMode={isDarkMode} />
          )}
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => setShowAlertModal(true)}
          >
            <Ionicons name="notifications" size={24} color="#8AA9B8" />
            <Text style={styles.alertButtonText}>View Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#8AA9B8" />
            <Text style={styles.darkModeButtonText}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        alerts={alerts}
        settings={settings}
        onUpdateSettings={setSettings}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3D8F4',
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  darkContent: {
    backgroundColor: '#121212',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1C1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  alertButtonText: {
    color: '#8AA9B8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  darkModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  darkModeButtonText: {
    color: '#8AA9B8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomePage;
