import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { theme } from '../utils/theme';
import type { MoodType } from '../types/wellness';

interface MoodTrackerProps {
  onMoodSelect: (mood: MoodType) => void;
  selectedMood?: MoodType;
}

export function MoodTracker({ onMoodSelect, selectedMood }: MoodTrackerProps) {
  const moods = [
    { type: 'happy', color: theme.colors.yellow, label: 'Happy' },
    { type: 'sad', color: theme.colors.pink, label: 'Sad' },
    { type: 'tired', color: theme.colors.blue, label: 'Tired' },
    { type: 'stressed', color: theme.colors.green, label: 'Stressed' },
  ] as const;

  return (
    <Card>
      <Text style={styles.title}>Parent</Text>
      <Text style={styles.subtitle}>Mood & Energy</Text>
      <View style={styles.moodGrid}>
        {moods.map(({ type, color, label }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.moodButton,
              { backgroundColor: color },
              selectedMood === type && styles.selectedMood
            ]}
            onPress={() => onMoodSelect(type)}
          >
            <View style={styles.moodCircle} />
            <Text style={styles.moodLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  moodCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  moodLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
});