export interface SensorData {
    id: string;
    ambient_temperature: number;
    object_temperature: number;
    temperature: number;
    humidity: number;
    timestamp: Date;
    [key: string]: any;
  }
export default SensorData  