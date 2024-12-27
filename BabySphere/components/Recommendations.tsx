import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { GradientButton } from './ui/GradientButton';
import { theme } from '../utils/theme';

export function Recommendations() {
  return (
    <Card>
      <Text style={styles.title}>Processing for</Text>
      <Text style={styles.subtitle}>Recommendations</Text>
      
      <View style={styles.buttonContainer}>
        <GradientButton
          colors={[theme.colors.blue, theme.colors.green]}
          label="Try yoga"
          onPress={() => {}}
        />
        <GradientButton
          colors={[theme.colors.yellow, theme.colors.pink]}
          label="Meditate"
          onPress={() => {}}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
});