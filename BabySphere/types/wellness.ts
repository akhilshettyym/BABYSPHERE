export type TimeRange = 'day' | 'week' | 'month';

export interface WellnessLog {
  id: string;
  date: string;
  userId: string;
  mood: string;
  energyLevel?: number;
  stressLevel?: number;
  sleep?: {
    quality: number;
    duration?: number;
  };
  notes?: string;
}

export interface ProcessedWellnessData {
  averages: {
    mood: number;
    sleep: number;
    energy: number;
    stress: number;
  };
  trends: {
    mood: TrendPoint[];
    sleep: TrendPoint[];
    energy: TrendPoint[];
  };
  summary: {
    insights: string[];
    recommendations: string[];
  };
}

interface TrendPoint {
  date: string;
  value: number;
}