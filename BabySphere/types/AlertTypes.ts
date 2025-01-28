export interface ThresholdSettings {
  babyTemperature: {
    min: number;
    max: number;
  };
  roomTemperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
  spO2: {
    min: number;
    max: number;
  };
  heartRate: {
    min: number;
    max: number;
  };
}

export interface Alert {
  id: string;
  timestamp: Date;
  type: 'babyTemperature' | 'roomTemperature' | 'humidity' | 'spO2' | 'heartRate';
  value: number;
  message: string;
}

export const defaultSettings: ThresholdSettings = {
  babyTemperature: { min: 36.0, max: 37.8 },
  roomTemperature: { min: 18.0, max: 24.0 },
  humidity: { min: 30, max: 70 },
  spO2: { min: 92, max:100 },
  heartRate: { min: 100, max: 180 }
};