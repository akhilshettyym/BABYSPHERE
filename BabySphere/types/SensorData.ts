export interface SensorData {
  id: string;
  ambient_temperature: number;
  baby_temperature: number; // Rename from object_temperature
  humidity: number;
  spo2: number; // New field for SpO2
  heartRate: number; // New field for heart rate
  timestamp: Date;
  [key: string]: any; // Allow dynamic fields for flexibility
  }
export default SensorData  