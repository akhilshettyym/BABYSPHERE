import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { GradientButton } from './ui/GradientButton';
import { colors } from '../utils/colors';

export function RecommendationsCard() {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Processing for</Text>
      <Text style={styles.subtitle}>Recomments</Text>
      
      <View style={styles.buttonContainer}>
        <GradientButton
          colors={colors.buttonBlue}
          label="Try yoga"
          onPress={() => {}}
          style={styles.button}
        />
        <GradientButton
          colors={colors.buttonPink}
          label="Try yoga"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardAlt,
  },
  title: {
    fontSize: 14,
    color: colors.secondary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});