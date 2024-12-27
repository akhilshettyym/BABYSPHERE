export type MoodType = 'happy' | 'content' | 'neutral' | 'stressed' | 'exhausted';

export interface SleepData {
  duration: number;
  quality: number;
  date: string;
}

export interface WellnessLog {
  id: string;
  date: string;
  mood: MoodType;
  energyLevel: number;
  notes?: string;
  sleep?: SleepData;
  stressLevel?: number;
}

export interface CurrentLog extends Partial<Omit<WellnessLog, 'id'>> {
  date: string;
}