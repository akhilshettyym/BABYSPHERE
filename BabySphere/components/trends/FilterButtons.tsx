import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

type TimeRange = 'day' | 'week' | 'month';

interface FilterButtonsProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function FilterButtons({ selectedRange, onRangeChange }: FilterButtonsProps) {
  const ranges: TimeRange[] = ['day', 'week', 'month'];

  return (
    <View style={styles.container}>
      {ranges.map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.button,
            selectedRange === range && styles.selectedButton
          ]}
          onPress={() => onRangeChange(range)}
        >
          <Text style={[
            styles.buttonText,
            selectedRange === range && styles.selectedButtonText
          ]}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});