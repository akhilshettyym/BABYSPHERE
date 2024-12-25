export interface Threshold {
  min: number;
  max: number;
}

export interface AlertThresholds {
  babyTemperature: Threshold;
  ambientTemperature: Threshold;
  humidity: Threshold;
  spO2: Threshold;
  heartRate: Threshold;
}

export const defaultThresholds: AlertThresholds = {
  babyTemperature: { min: 36.0, max: 37.8 },
  ambientTemperature: { min: 18, max: 24 },
  humidity: { min: 30, max: 70 },
  spO2: { min: 92, max: 100 },
  heartRate: { min: 100, max: 180 },
};

export interface Alert {
  id: string;
  type: keyof AlertThresholds;
  message: string;
  timestamp: string;
  value: number;
}


