import type { WellnessLog } from '../types/wellness';

export const generateInsights = (logs: WellnessLog[]) => {
  if (logs.length === 0) return [];

  const latestLog = logs[logs.length - 1];
  const lastWeekLogs = logs.slice(-7);
  const insights = [];

  // Analyze mood patterns
  const moodCounts = lastWeekLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  // Sleep analysis
  const averageSleep = lastWeekLogs
    .filter(log => log.sleep?.duration)
    .reduce((acc, log) => acc + (log.sleep?.duration || 0), 0) / lastWeekLogs.length;

  // Current state insights
  if (latestLog.energyLevel <= 2) {
    insights.push({
      type: 'energy',
      title: 'Low Energy Alert',
      description: 'Your energy levels are low. Consider:',
      recommendations: [
        'Take a 20-minute power nap',
        'Try some energizing breathing exercises',
        'Have a healthy snack with protein and complex carbs',
        'Take a short walk outside'
      ]
    });
  }

  if (latestLog.mood === 'stressed' || latestLog.mood === 'exhausted') {
    insights.push({
      type: 'stress',
      title: 'Stress Management',
      description: 'You seem to be experiencing stress. Try these:',
      recommendations: [
        '5-minute mindful breathing exercise',
        'Quick meditation session',
        'Listen to calming music',
        'Call a friend or family member for support'
      ]
    });
  }

  // Sleep recommendations
  if (averageSleep < 6) {
    insights.push({
      type: 'sleep',
      title: 'Sleep Optimization',
      description: 'Your sleep duration has been below recommended levels:',
      recommendations: [
        'Try to go to bed 30 minutes earlier',
        'Create a relaxing bedtime routine',
        'Avoid screens 1 hour before bed',
        'Consider asking for help with night feedings'
      ]
    });
  }

  // Weekly patterns
  if (dominantMood) {
    insights.push({
      type: 'pattern',
      title: 'Weekly Mood Pattern',
      description: `You've been feeling ${dominantMood} frequently this week.`,
      recommendations: [
        'Reflect on what might be contributing to this pattern',
        'Consider discussing your feelings with a healthcare provider',
        'Try to identify triggers and potential solutions',
        'Remember that it is okay to ask for help'
      ]
    });
  }

  return insights;
};