import { SensorData, TimeframeOption, ChartDataPoint } from '../types/babyMonitor';

export const filterData = (data: SensorData[], timeframe: TimeframeOption): SensorData[] => {
  if (!data || data.length === 0) {
    return [];
  }

  const now = new Date();
  switch (timeframe) {
    case 'hourly':
      return data.filter(d => now.getTime() - d.timestamp.getTime() <= 60 * 60 * 1000);
    case 'daily':
      return data.filter(d => now.getTime() - d.timestamp.getTime() <= 24 * 60 * 60 * 1000);
    case 'weekly':
      return data.filter(d => now.getTime() - d.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000);
    default:
      return data;
  }
};

export const processChartData = (data: SensorData[], selectedGraph: keyof SensorData): ChartDataPoint[] => {
  return data.map(d => ({
    value: d[selectedGraph] as number,
    label: d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
};

