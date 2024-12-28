import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, limit as setLimit } from 'firebase/firestore';
import type { WellnessLog } from '../types/wellness';

export const wellnessService = {
  async saveMoodLog(log: Omit<WellnessLog, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'wellnessLogs'), {
        ...log,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving mood log:', error);
      throw error;
    }
  },

  async getRecentLogs(limit = 7) {
    try {
      const q = query(
        collection(db, 'wellnessLogs'),
        orderBy('createdAt', 'desc'),
        setLimit(limit) // Wrap the number with the `limit` function
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WellnessLog[];
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }
};
