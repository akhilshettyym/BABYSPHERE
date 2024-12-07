export interface SensorData {
    id: string;
    baby_temperature: number;
    ambient_temperature: number;
    humidity: number;
    spo2: number;
    heartRate: number;
    timestamp: Date;
  }
  
  export interface ChartDataPoint {
    value: number;
    label: string;
  }
  
  export type TimeframeOption = 'hourly' | 'daily' | 'weekly';
  export type GraphOption = keyof SensorData;
  
  