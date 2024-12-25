import { useState, useCallback } from 'react';
import { Alert as RNAlert } from 'react-native';
import { Alert, ThresholdSettings } from '../types/AlertTypes';
import { triggerAlertVibration } from '../utils/vibrationUtils';
import { sendNotification } from '../utils/notificationUtils';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    
    // Trigger vibration
    triggerAlertVibration();

    // Send notification
    await sendNotification(
      'Baby Health Alert',
      alert.message
    );

    // Show in-app alert
    RNAlert.alert('Health Alert', alert.message);

    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const checkThresholds = useCallback((
    data: { [key: string]: number },
    settings: ThresholdSettings
  ) => {
    Object.entries(data).forEach(([key, value]) => {
      const threshold = settings[key as keyof ThresholdSettings];
      if (!threshold) return;

      if ('min' in threshold && value < threshold.min) {
        addAlert({
          type: key as Alert['type'],
          value,
          message: `Urgent: Baby's ${key.toUpperCase()} is ${value} which is below the safe range. Please check immediately.`,
        });
      }
      
      if ('max' in threshold && value > threshold.max) {
        addAlert({
          type: key as Alert['type'],
          value,
          message: `Urgent: Baby's ${key.toUpperCase()} is ${value} which is above the safe range. Please check immediately.`,
        });
      }
    });
  }, [addAlert]);

  return {
    alerts,
    addAlert,
    checkThresholds,
  };
};