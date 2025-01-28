import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { InsightCard } from './ui/InsightCard';
import { theme } from '../utils/theme';

export function PersonalizedInsights() {
  const insights = [
    { title: 'Remember to hydrate', icon: '💧', color: theme.colors.blue },
    { title: 'Take a break', icon: '☕', color: theme.colors.yellow },
    { title: 'Meditate', icon: '🧘‍♀️', color: theme.colors.green },
    { title: 'High stress', icon: '🌿', color: theme.colors.pink },
  ];

  return (
    <Card>
      <Text style={styles.title}>Personalized Insights</Text>
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