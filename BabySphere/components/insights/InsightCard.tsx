import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

interface InsightCardProps {
  title: string;
  icon: string;
  color: string;
}

export function InsightCard({ title, icon, color }: InsightCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});