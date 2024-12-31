import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomSlider } from './ui/CustomSlider';
import { theme } from '../utils/theme';

interface SleepQualityProps {
  onQualityChange: (quality: number) => void;
  quality: number;
}

export function SleepQuality({ onQualityChange, quality }: SleepQualityProps) {
  const getQualityLabel = (value: number): string => {
    if (value <= 2) return 'Poor';
    if (value <= 5) return 'Average';
    if (value <= 8) return 'Good';
    return 'Excellent';
  };

  const handleQualityChange = (newQuality: number) => {
    onQualityChange(Math.round(newQuality));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How was your sleep last night?</Text>
      <Text style={styles.qualityLabel}>{getQualityLabel(quality)}</Text>
      <CustomSlider
        value={quality}
        minimumValue={1}
        maximumValue={10}
        onValueChange={handleQualityChange}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.border}
        showLabels={false}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 16,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
  },
});

