import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import { theme } from '../../utils/theme';

interface CustomSliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  style?: any;
  showLabels?: boolean;
}

export function CustomSlider({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  minimumTrackTintColor = theme.colors.primary,
  maximumTrackTintColor = theme.colors.border,
  style,
  showLabels = true,
}: CustomSliderProps) {
  const [width, setWidth] = useState(0);

  const getValueFromGesture = (pageX: number) => {
    const ratio = Math.max(0, Math.min(1, pageX / width));
    const newValue = minimumValue + ratio * (maximumValue - minimumValue);
    return Math.round(newValue);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      const newValue = getValueFromGesture(evt.nativeEvent.locationX);
      onValueChange(newValue);
    },
    onPanResponderMove: (evt: GestureResponderEvent) => {
      const newValue = getValueFromGesture(evt.nativeEvent.locationX);
      onValueChange(newValue);
    },
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const progress = (value - minimumValue) / (maximumValue - minimumValue);

  const renderNumberLabels = () => {
    const labels = [];
    for (let i = minimumValue; i <= maximumValue; i++) {
      labels.push(
        <Text key={i} style={[styles.numberLabel, { left: `${((i - minimumValue) / (maximumValue - minimumValue)) * 100}%` }]}>
          {i}
        </Text>
      );
    }
    return labels;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.numberLabelContainer}>
        {renderNumberLabels()}
      </View>
      <View
        style={styles.sliderContainer}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
          <View
            style={[
              styles.progress,
              {
                backgroundColor: minimumTrackTintColor,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            { left: `${progress * 100}%` },
          ]}
        />
      </View>
      {showLabels && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{minimumValue}</Text>
          <Text style={styles.label}>{maximumValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  numberLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    height: 20,
  },
  numberLabel: {
    position: 'absolute',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    width: 20,
    marginLeft: -10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    transform: [{ translateX: -10 }],
    ...theme.shadows.card,
  },
});