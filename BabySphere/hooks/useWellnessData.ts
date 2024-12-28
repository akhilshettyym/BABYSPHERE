import { useState, useEffect } from 'react';
import { wellnessService } from '../components/wellnessService';
import type { WellnessLog } from '../types/wellness';

type TimeRange = 'day' | 'week' | 'month';

interface WeeklyAverages {
  mood: number;
  sleep: number;
}

interface TrendData {
  mood: { x: Date; y: number }[];
  sleep: { x: Date; y: number }[];
}

export function useWellnessData(timeRange: TimeRange = 'week') {
  const [loading, setLoading] = useState(true);
  const [weeklyAverages, setWeeklyAverages] = useState<WeeklyAverages | null>(null);
  const [trendData, setTrendData] = useState<TrendData>({ mood: [], sleep: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const logs = await wellnessService.getRecentLogs(7);
        
        // Calculate averages
        const averages = calculateAverages(logs);
        setWeeklyAverages(averages);
        
        // Process trend data
        const processed = processTrendData(logs);
        setTrendData(processed);
      } catch (error) {
        console.error('Error fetching wellness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return {
    loading,
    weeklyAverages,
    trendData,
  };
}

function calculateAverages(logs: WellnessLog[]): WeeklyAverages {
  if (!logs.length) return { mood: 0, sleep: 0 };

  const total = logs.reduce((acc, log) => ({
    mood: acc.mood + getMoodValue(log.mood),
    sleep: acc.sleep + (log.sleep?.quality || 0),
  }), { mood: 0, sleep: 0 });

  return {
    mood: Math.round((total.mood / logs.length) * 10) / 10,
    sleep: Math.round((total.sleep / logs.length) * 10) / 10,
  };
}

function processTrendData(logs: WellnessLog[]): TrendData {
  return {
    mood: logs.map(log => ({
      x: new Date(log.date),
      y: getMoodValue(log.mood),
    })),
    sleep: logs.map(log => ({
      x: new Date(log.date),
      y: log.sleep?.quality || 0,
    })),
  };
}

function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    happy: 5,
    content: 4,
    neutral: 3,
    sad: 2,
    stressed: 1,
  };
  return moodValues[mood] || 3;
}