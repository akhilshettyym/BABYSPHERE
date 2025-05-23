import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../utils/theme';

interface GradientButtonProps {
  onPress: () => void;
  colors: [string, string];
  label: string;
  style?: ViewStyle;
}

export function GradientButton({
  onPress,
  colors = [theme.colors.primary, theme.colors.secondary],
  label,
  style,
}: GradientButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
});
