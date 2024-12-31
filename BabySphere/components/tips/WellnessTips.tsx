import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { TipCard } from './TipCard';
import { theme } from '../../utils/theme';

const WELLNESS_TIPS = [
  {
    title: 'Morning Routine',
    description: 'Start your day with 5 minutes of deep breathing',
    icon: '🌅',
  },
  {
    title: 'Self-Care Break',
    description: 'Take short breaks throughout the day for self-care',
    icon: '☕',
  },
  {
    title: 'Evening Wind Down',
    description: 'Create a relaxing bedtime routine for better sleep',
    icon: '🌙',
  },
];

export function WellnessTips() {
  return (
    <Card>
      <Text style={styles.title}>Wellness Tips</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {WELLNESS_TIPS.map((tip, index) => (
          <TipCard
            key={index}
            title={tip.title}
            description={tip.description}
            icon={tip.icon}
          />
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
});