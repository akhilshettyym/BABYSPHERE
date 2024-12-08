import type { WellnessLog } from '../types/wellness';

const STORAGE_KEY = 'wellness_logs';

export const storage = {
  saveLogs: (logs: WellnessLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  getLogs: (): WellnessLog[] => {
    try {
      const logs = localStorage.getItem(STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error retrieving logs:', error);
      return [];
    }
  }
};