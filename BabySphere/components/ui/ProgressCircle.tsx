import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressCircleProps {
  colors: string[];
  size?: number;
  progress?: number;
}

export function ProgressCircle({ colors, size = 60, progress = 1 }: ProgressCircleProps) {
  return (
    <LinearGradient
      colors={colors}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});