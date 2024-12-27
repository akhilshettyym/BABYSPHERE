export interface ThresholdSettings {
    babyTemperature: { min: number; max: number };
    ambientTemperature: { min: number; max: number };
    humidity: { min: number; max: number };
    spO2: { min: number };
    heartRate: { min: number; max: number };
    cryingDuration: number;
  }
  
  