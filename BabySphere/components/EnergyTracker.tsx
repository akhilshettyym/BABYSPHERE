import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { CircleProgress } from './ui/CircleProgress';
import { CustomSlider } from './ui/CustomSlider';
import { theme } from '../utils/theme';

interface EnergyTrackerProps {
  onEnergySelect: (level: number) => void;
  energyLevel: number;
}

export function EnergyTracker({ onEnergySelect, energyLevel }: EnergyTrackerProps) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Mood and Energy</Text>
        <View style={styles.actions}>
          <CircleProgress progress={energyLevel / 10} />
        </View>
      </View>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>0</Text>
        <CustomSlider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={energyLevel}
          onValueChange={onEnergySelect}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
        />
        <Text style={styles.label}>10</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});