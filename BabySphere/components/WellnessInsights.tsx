import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { colors } from '../utils/colors';

export function WellnessInsights() {
  const insights = [
    { title: 'Remember to hydrate', icon: '💧', color: '#00A896' },
    { title: 'Take a break', icon: '☕', color: '#FFE4A7' },
    { title: 'Take a break', icon: '🌿', color: '#98E2C6' },
    { title: 'High stress', icon: '🧘‍♀️', color: '#FFB5BA' }
  ];

  return (
    <Card>
      <Text style={styles.title}>Personalized Insights</Text>
      <View style={styles.grid}>
        {insights.map((insight, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.insightCard, { backgroundColor: insight.color }]}
          >
            <Text style={styles.insightIcon}>{insight.icon}</Text>
            <Text style={styles.insightText}>{insight.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  insightIcon: {
    fontSize: 24,
  },
  insightText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});