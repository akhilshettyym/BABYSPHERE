import { TimeRange } from '../types/wellness';

export function validateDateRange(timeRange: TimeRange): void {
  const validRanges = ['day', 'week', 'month'];
  
  if (!validRanges.includes(timeRange)) {
    throw new Error(`Invalid time range: ${timeRange}`);
  }
}

export function validateWellnessLog(log: any): void {
  if (!log.date) {
    throw new Error('Log must include a date');
  }

  if (!log.mood) {
    throw new Error('Log must include a mood');
  }

  if (log.sleep && typeof log.sleep.quality !== 'number') {
    throw new Error('Sleep quality must be a number');
  }

  if (log.energyLevel && typeof log.energyLevel !== 'number') {
    throw new Error('Energy level must be a number');
  }
}