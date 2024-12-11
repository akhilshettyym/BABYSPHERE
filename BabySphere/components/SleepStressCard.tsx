import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { GradientProgress } from './ui/GradientProgress';
import { theme } from '../utils/theme';

export function SleepStressCard() {
  return (
    <Card>
      <Text style={styles.title}>Sleep and Stress</Text>
      <View style={styles.container}>
        <GradientProgress
          value={5}
          maxValue={10}
          label="SLEEP"
          colors={[theme.colors.blue, theme.colors.green]}
        />
        <GradientProgress
          value={3}
          maxValue={10}
          label="STRESS"
          colors={[theme.colors.yellow, theme.colors.pink]}
        />
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});