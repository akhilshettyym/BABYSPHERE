import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Svg, Circle, Line, G, Text as SvgText } from 'react-native-svg';

interface CircularTimePickerProps {
  initialHour: number;
  initialMinute: number;
  onTimeChange: (hour: number, minute: number) => void;
}

export const CircularTimePicker: React.FC<CircularTimePickerProps> = ({
  initialHour,
  initialMinute,
  onTimeChange,
}) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [inputMode, setInputMode] = useState(false);

  useEffect(() => {
    onTimeChange(hour, minute);
  }, [hour, minute]);

  const size = 250;
  const radius = size / 2 - 20;
  const center = size / 2;

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const dx = locationX - center;
    const dy = locationY - center;
    const angle = Math.atan2(dy, dx);
    let value = Math.round(((angle + Math.PI) / (2 * Math.PI)) * (mode === 'hour' ? 12 : 60));

    if (mode === 'hour') {
      value = value === 0 ? 12 : value;
      setHour(value);
    } else {
      value = value === 60 ? 0 : value;
      setMinute(value);
    }
  };

  const renderClockFace = () => {
    const items = mode === 'hour' ? 12 : 60;
    const itemAngle = (2 * Math.PI) / items;

    return Array.from({ length: items }).map((_, index) => {
      const angle = index * itemAngle - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const value = mode === 'hour' ? (index === 0 ? 12 : index) : index * 5;

      return (
        <G key={index}>
          {(mode === 'hour' || index % 5 === 0) && (
            <SvgText
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={16}
              fill="#8AA9B8"
            >
              {value}
            </SvgText>
          )}
          {mode === 'minute' && (
            <Circle
              cx={center + (radius - 10) * Math.cos(angle)}
              cy={center + (radius - 10) * Math.sin(angle)}
              r={2}
              fill="#8AA9B8"
            />
          )}
        </G>
      );
    });
  };

  const renderHand = () => {
    const value = mode === 'hour' ? hour : minute;
    const angle = ((value / (mode === 'hour' ? 12 : 60)) * 2 * Math.PI) - (Math.PI / 2);
    const x = center + radius * 0.8 * Math.cos(angle);
    const y = center + radius * 0.8 * Math.sin(angle);

    return (
      <G>
        <Line
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="#B4E3A7"
          strokeWidth={2}
        />
        <Circle
          cx={x}
          cy={y}
          r={8}
          fill="#B4E3A7"
        />
      </G>
    );
  };

  const handleInputChange = (text: string, type: 'hour' | 'minute') => {
    const num = parseInt(text, 10);
    if (isNaN(num)) return;

    if (type === 'hour') {
      setHour(num > 23 ? 23 : num);
    } else {
      setMinute(num > 59 ? 59 : num);
    }
  };

  return (
    <View style={styles.container}>
      {inputMode ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={2}
            value={hour.toString().padStart(2, '0')}
            onChangeText={(text) => handleInputChange(text, 'hour')}
          />
          <Text style={styles.inputSeparator}>:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={2}
            value={minute.toString().padStart(2, '0')}
            onChangeText={(text) => handleInputChange(text, 'minute')}
          />
        </View>
      ) : (
        <Svg width={size} height={size} onPress={handlePress}>
          <Circle cx={center} cy={center} r={radius} stroke="#E2E8F0" strokeWidth={2} fill="none" />
          {renderClockFace()}
          {renderHand()}
        </Svg>
      )}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'hour' && styles.activeMode]}
          onPress={() => setMode('hour')}
        >
          <Text style={styles.modeButtonText}>{hour.toString().padStart(2, '0')}</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>:</Text>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'minute' && styles.activeMode]}
          onPress={() => setMode('minute')}
        >
          <Text style={styles.modeButtonText}>{minute.toString().padStart(2, '0')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputModeButton}
          onPress={() => setInputMode(!inputMode)}
        >
          <Text style={styles.inputModeButtonText}>
            {inputMode ? 'Clock' : 'Input'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  modeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  activeMode: {
    backgroundColor: '#B4E3A7',
  },
  modeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8AA9B8',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginHorizontal: 10,
  },
  inputModeButton: {
    marginLeft: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  inputModeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8AA9B8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8AA9B8',
    textAlign: 'center',
    width: 80,
  },
  inputSeparator: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginHorizontal: 10,
  },
});

