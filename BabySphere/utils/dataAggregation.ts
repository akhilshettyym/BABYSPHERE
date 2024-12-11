import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Types
interface AggregatedValue {
  min: number;
  max: number;
  avg: number;
}

interface AggregatedData {
  date: Date;
  ambient_temperature: AggregatedValue;
  baby_temperature: AggregatedValue;
  humidity: AggregatedValue;
  spo2: AggregatedValue;
  heartRate: AggregatedValue;
}

interface SensorData {
  id: string;
  timestamp: string;
  baby_temperature: number;
  spo2: number;
  heartRate: number;
  ambient_temperature?: number; // Optional if not always present
  humidity?: number; // Optional if not always present
}

// Helper function to get the start of the day in the user's timezone
const getStartOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Helper function to get the start of the week in the user's timezone
const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
};

// Function to fetch real-time data
export const fetchRealtimeData = async (limitCount: number = 60): Promise<SensorData[]> => {
  const q = query(
    collection(db, 'sensor_data'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    ambient_temperature: doc.data().ambient_temperature ?? 0, // Default to 0 if missing
    humidity: doc.data().humidity ?? 0, // Default to 0 if missing
  } as SensorData)).reverse();
};

// Function to fetch hourly data
export const fetchHourlyData = async (hours: number = 24): Promise<SensorData[]> => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000);

  const q = query(
    collection(db, 'sensor_data'),
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate),
    orderBy('timestamp', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    ambient_temperature: doc.data().ambient_temperature ?? 0,
    humidity: doc.data().humidity ?? 0,
  } as SensorData));
};

// Function to fetch and aggregate daily data
export const fetchDailyData = async (days: number = 7): Promise<AggregatedData[]> => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const q = query(
    collection(db, 'sensor_data'),
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate),
    orderBy('timestamp', 'asc')
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    ambient_temperature: doc.data().ambient_temperature ?? 0,
    humidity: doc.data().humidity ?? 0,
  } as SensorData));

  return aggregateDailyData(data);
};

// Function to fetch and aggregate weekly data
export const fetchWeeklyData = async (weeks: number = 4): Promise<AggregatedData[]> => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  const q = query(
    collection(db, 'sensor_data'),
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate),
    orderBy('timestamp', 'asc')
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    ambient_temperature: doc.data().ambient_temperature ?? 0,
    humidity: doc.data().humidity ?? 0,
  } as SensorData));

  return aggregateWeeklyData(data);
};

// Helper function to aggregate daily data
const aggregateDailyData = (data: SensorData[]): AggregatedData[] => {
  const dailyData: { [key: string]: SensorData[] } = {};

  data.forEach(item => {
    const date = getStartOfDay(new Date(item.timestamp)).toISOString();
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  return Object.entries(dailyData).map(([date, items]) => ({
    date: new Date(date),
    ambient_temperature: calculateAggregates(items.map(item => item.ambient_temperature ?? 0)),
    baby_temperature: calculateAggregates(items.map(item => item.baby_temperature)),
    humidity: calculateAggregates(items.map(item => item.humidity ?? 0)),
    spo2: calculateAggregates(items.map(item => item.spo2)),
    heartRate: calculateAggregates(items.map(item => item.heartRate)),
  }));
};

// Helper function to aggregate weekly data
const aggregateWeeklyData = (data: SensorData[]): AggregatedData[] => {
  const weeklyData: { [key: string]: SensorData[] } = {};

  data.forEach(item => {
    const date = getStartOfWeek(new Date(item.timestamp)).toISOString();
    if (!weeklyData[date]) {
      weeklyData[date] = [];
    }
    weeklyData[date].push(item);
  });

  return Object.entries(weeklyData).map(([date, items]) => ({
    date: new Date(date),
    ambient_temperature: calculateAggregates(items.map(item => item.ambient_temperature ?? 0)),
    baby_temperature: calculateAggregates(items.map(item => item.baby_temperature)),
    humidity: calculateAggregates(items.map(item => item.humidity ?? 0)),
    spo2: calculateAggregates(items.map(item => item.spo2)),
    heartRate: calculateAggregates(items.map(item => item.heartRate)),
  }));
};

// Helper function to calculate aggregates (min, max, avg)
const calculateAggregates = (values: number[]): AggregatedValue => {
  const validValues = values.filter(v => !isNaN(v));
  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    avg: validValues.reduce((sum, value) => sum + value, 0) / validValues.length,
  };
};
