export type MoodType = 'happy' | 'content' | 'neutral' | 'sad' | 'stressed';

export interface SleepData {
  quality: number;
  date: string;
}

export interface WellnessLog {
  id: string;
  date: string;
  mood: MoodType;
  sleep?: SleepData;
  notes?: string;
}

export interface CurrentLog extends Partial<Omit<WellnessLog, 'id'>> {
  date: string;
}