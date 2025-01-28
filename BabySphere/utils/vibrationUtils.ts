import { Vibration } from 'react-native';

// Pattern: vibrate for 500ms, pause for 200ms, vibrate for 500ms
const ALERT_PATTERN = [500, 200, 500];

export const triggerAlertVibration = () => {
  // Cancel any ongoing vibration
  Vibration.cancel();
  
  // Start new vibration pattern
  Vibration.vibrate(ALERT_PATTERN);
};