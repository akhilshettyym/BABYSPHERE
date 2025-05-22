import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { TipCard } from './TipCard';
import { theme } from '../../utils/theme';

const WELLNESS_TIPS = [
  {
    title: 'Morning Routine',
    description: 'Start your day with 5 minutes of deep breathing or meditation.',
    icon: '🌅',
  },
  {
    title: 'Self-Care Break',
    description: 'Take short breaks throughout the day for stretching or mindfulness.',
    icon: '☕',
  },
  {
    title: 'Evening Wind Down',
    description: 'Create a relaxing bedtime routine for better sleep quality.',
    icon: '🌙',
  },
  {
    title: 'Stay Hydrated',
    description: 'Drink plenty of water throughout the day to stay energized.',
    icon: '💧',
  },
  {
    title: 'Move Your Body',
    description: 'Incorporate at least 30 minutes of physical activity daily.',
    icon: '🏃‍♀️',
  },
  {
    title: 'Practice Gratitude',
    description: 'Write down 3 things you’re grateful for each day.',
    icon: '🙏',
  },
  {
    title: 'Limit Screen Time',
    description: 'Take regular breaks from screens to reduce eye strain and fatigue.',
    icon: '📱',
  },
  {
    title: 'Eat Mindfully',
    description: 'Focus on nourishing foods and avoid eating on the go.',
    icon: '🍎',
  },
  {
    title: 'Connect with Loved Ones',
    description: 'Spend quality time with friends or family regularly.',
    icon: '🤝',
  },
  {
    title: 'Practice Deep Relaxation',
    description: 'Try yoga, meditation, or progressive muscle relaxation.',
    icon: '🧘‍♂️',
  },
  {
    title: 'Spend Time in Nature',
    description: 'Take a walk outdoors to boost mood and reduce stress.',
    icon: '🌳',
  },
  {
    title: 'Laugh More',
    description: 'Watch a funny video or share jokes with friends to boost happiness.',
    icon: '😂',
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