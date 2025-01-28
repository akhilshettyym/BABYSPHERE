import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.card,
  },
});