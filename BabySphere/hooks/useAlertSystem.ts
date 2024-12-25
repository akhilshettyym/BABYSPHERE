import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '../types/AlertTypes';

export interface AlertThresholds {
  babyTemperature: { min: number; max: number };
  ambientTemperature: { min: number; max: number };
  humidity: { min: number; max: number };
  spO2: { min: number; max: number };
  heartRate: { min: number; max: number };
  cryingDuration: number;
}

const defaultThresholds: AlertThresholds = {
  babyTemperature: { min: 36.0, max: 37.8 },
  ambientTemperature: { min: 20, max: 24 },
  humidity: { min: 40, max: 60 },
  spO2: { min: 95, max: 100 },
  heartRate: { min: 60, max: 160 },
  cryingDuration: 600, // 10 minutes in seconds
};

export const useAlertSystem = () => {
  const [thresholds, setThresholds] = useState<AlertThresholds>(defaultThresholds);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastValues, setLastValues] = useState<Partial<Record<keyof AlertThresholds, number>>>({});

  useEffect(() => {
    loadThresholds();
    loadAlerts();
  }, []);

  const loadThresholds = async () => {
    try {
      const storedThresholds = await AsyncStorage.getItem('alertThresholds');
      if (storedThresholds) {
        setThresholds(JSON.parse(storedThresholds));
      }
    } catch (error) {
      console.error('Error loading thresholds:', error);
    }
  };

  const saveThresholds = async (newThresholds: AlertThresholds) => {
    try {
      await AsyncStorage.setItem('alertThresholds', JSON.stringify(newThresholds));
      setThresholds(newThresholds);
    } catch (error) {
      console.error('Error saving thresholds:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const storedAlerts = await AsyncStorage.getItem('babyAlerts');
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const saveAlert = async (newAlert: Alert) => {
    try {
      const updatedAlerts = [newAlert, ...alerts].slice(0, 50); // Keep only the last 50 alerts
      await AsyncStorage.setItem('babyAlerts', JSON.stringify(updatedAlerts));
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error('Error saving alert:', error);
    }
  };

  const triggerAlert = useCallback(
    (type: keyof AlertThresholds, value: number) => {
      const threshold = thresholds[type];
      const lastValue = lastValues[type];

      if (typeof threshold === 'number') {
        if (value < threshold && (!lastValue || lastValue >= threshold)) {
          const message = `${type} is below the threshold: ${value}`;
          saveAlert({ id: Date.now().toString(), type, message, timestamp: new Date().toISOString(), value });
        }
      } else if ('min' in threshold && 'max' in threshold) {
        if (
          (value < threshold.min && (!lastValue || lastValue >= threshold.min)) ||
          (value > threshold.max && (!lastValue || lastValue <= threshold.max))
        ) {
          const message = `${type} is out of range: ${value}`;
          saveAlert({ id: Date.now().toString(), type, message, timestamp: new Date().toISOString(), value });
        }
      }

      setLastValues((prev) => ({ ...prev, [type]: value }));
    },
    [thresholds, lastValues]
  );

  return {
    thresholds,
    setThresholds: saveThresholds,
    alerts,
    triggerAlert,
  };
};

