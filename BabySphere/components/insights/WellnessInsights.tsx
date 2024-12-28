import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { InsightCard } from './InsightCard';
import { useWellnessData } from '../../hooks/useWellnessData';
import { theme } from '../../utils/theme';

export function WellnessInsights() {
  const { weeklyAverages, loading } = useWellnessData();

  const insights = [
    {
      title: `Avg. Mood: ${weeklyAverages?.mood || 'N/A'}`,
      icon: '😊',
      color: theme.colors.yellow,
    },
    {
      title: `Sleep: ${weeklyAverages?.sleep || 'N/A'}/10`,
      icon: '😴',
      color: theme.colors.blue,
    },
    {
      title: 'Take a Break',
      icon: '🧘‍♀️',
      color: theme.colors.green,
    },
    {
      title: 'Stay Hydrated',
      icon: '💧',
      color: theme.colors.pink,
    },
  ];

  if (loading) {
    return (
      <Card>
        <Text style={styles.title}>Loading insights...</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.title}>Your Wellness Insights</Text>
      <View style={styles.grid}>
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            icon={insight.icon}
            color={insight.color}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});