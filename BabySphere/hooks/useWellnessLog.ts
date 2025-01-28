import { useState, useCallback } from 'react';
import { wellnessService } from '../components/wellnessService';
import type { WellnessLog, MoodType } from '../types/wellness';

export function useWellnessLog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMoodLog = useCallback(async (mood: MoodType, sleepQuality: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const log: Omit<WellnessLog, 'id'> = {
        date: new Date().toISOString(),
        mood,
        sleep: {
          quality: sleepQuality,
          date: new Date().toISOString()
        }
      };
      await wellnessService.saveMoodLog(log);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mood log');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    saveMoodLog
  };
}