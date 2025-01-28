import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { WellnessLog, TimeRange } from '../types/wellness';
import { processWellnessData } from '../utils/dataProcessor';
import { validateDateRange } from '../utils/validation';

export const wellnessService = {
  /**
   * Fetches wellness logs for a specific time range
   * @param timeRange - The time range to fetch data for
   * @param userId - The user ID to fetch data for
   * @returns Processed wellness data
   */
  async getWellnessData(timeRange: TimeRange, userId: string) {
    try {
      validateDateRange(timeRange);

      const dateLimit = getDateLimit(timeRange);
      const logsRef = collection(db, 'wellnessLogs');
      
      const q = query(
        logsRef,
        where('userId', '==', userId),
        where('date', '>=', dateLimit),
        orderBy('date', 'desc'),
        limit(100)
      );

      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WellnessLog[];

      return processWellnessData(logs, timeRange);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      throw new Error('Failed to fetch wellness data');
    }
  }
};

function getDateLimit(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7));
  }
}