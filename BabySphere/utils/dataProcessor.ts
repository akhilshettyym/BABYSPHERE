import { WellnessLog, TimeRange, ProcessedWellnessData } from '../types/wellness';

/**
 * Processes raw wellness logs into formatted data for visualization
 * @param logs - Raw wellness logs from the database
 * @param timeRange - The time range for data processing
 * @returns Processed wellness data
 */
export function processWellnessData(
  logs: WellnessLog[],
  timeRange: TimeRange
): ProcessedWellnessData {
  if (!logs.length) {
    return createEmptyData();
  }

  const groupedData = groupDataByDate(logs);
  const averages = calculateAverages(groupedData);
  const trends = calculateTrends(groupedData, timeRange);

  return {
    averages,
    trends,
    summary: generateSummary(averages, trends)
  };
}

function groupDataByDate(logs: WellnessLog[]) {
  return logs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, WellnessLog[]>);
}

function calculateAverages(groupedData: Record<string, WellnessLog[]>) {
  const totals = Object.values(groupedData).reduce(
    (acc, dayLogs) => {
      const dayAvg = dayLogs.reduce(
        (dayAcc, log) => ({
          mood: dayAcc.mood + getMoodValue(log.mood),
          sleep: dayAcc.sleep + (log.sleep?.quality || 0),
          energy: dayAcc.energy + (log.energyLevel || 0),
          stress: dayAcc.stress + (log.stressLevel || 0),
        }),
        { mood: 0, sleep: 0, energy: 0, stress: 0 }
      );

      return {
        mood: acc.mood + dayAvg.mood / dayLogs.length,
        sleep: acc.sleep + dayAvg.sleep / dayLogs.length,
        energy: acc.energy + dayAvg.energy / dayLogs.length,
        stress: acc.stress + dayAvg.stress / dayLogs.length,
      };
    },
    { mood: 0, sleep: 0, energy: 0, stress: 0 }
  );

  const daysCount = Object.keys(groupedData).length;
  return {
    mood: Math.round((totals.mood / daysCount) * 10) / 10,
    sleep: Math.round((totals.sleep / daysCount) * 10) / 10,
    energy: Math.round((totals.energy / daysCount) * 10) / 10,
    stress: Math.round((totals.stress / daysCount) * 10) / 10,
  };
}

function calculateTrends(
  groupedData: Record<string, WellnessLog[]>,
  timeRange: TimeRange
) {
  const dates = Object.keys(groupedData).sort();
  
  return {
    mood: dates.map(date => ({
      date,
      value: average(groupedData[date].map(log => getMoodValue(log.mood))),
    })),
    sleep: dates.map(date => ({
      date,
      value: average(groupedData[date].map(log => log.sleep?.quality || 0)),
    })),
    energy: dates.map(date => ({
      date,
      value: average(groupedData[date].map(log => log.energyLevel || 0)),
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

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function createEmptyData(): ProcessedWellnessData {
  return {
    averages: { mood: 0, sleep: 0, energy: 0, stress: 0 },
    trends: { mood: [], sleep: [], energy: [] },
    summary: { insights: [], recommendations: [] }
  };
}

function generateSummary(averages: any, trends: any) {
  const insights = [];
  const recommendations = [];

  // Generate insights based on data patterns
  if (averages.mood < 3) {
    insights.push('Your mood has been lower than usual');
    recommendations.push('Consider scheduling a relaxing activity');
  }

  if (averages.sleep < 6) {
    insights.push('Your sleep quality could be improved');
    recommendations.push('Try establishing a regular bedtime routine');
  }

  return { insights, recommendations };
}