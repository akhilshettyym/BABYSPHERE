import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThresholdSettings } from '../../types/AlertTypes';

interface SettingsFormProps {
  settings: ThresholdSettings;
  onSettingsChange: (settings: ThresholdSettings) => void;
  isDarkMode: boolean;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSettingsChange,
  isDarkMode,
}) => {
  const updateSetting = (
    category: keyof ThresholdSettings,
    field: 'min' | 'max',
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    onSettingsChange({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: numValue,
      },
    });
  };

  return (
    <View style={styles.container}>
      <SettingSection
        title="Baby Temperature (°C)"
        min={settings.babyTemperature.min}
        max={settings.babyTemperature.max}
        onChangeMin={(value) => updateSetting('babyTemperature', 'min', value)}
        onChangeMax={(value) => updateSetting('babyTemperature', 'max', value)}
        isDarkMode={isDarkMode}
      />
      <SettingSection
        title="Heartbeat (BPM)"
        min={settings.heartRate.min}
        max={settings.heartRate.max}
        onChangeMin={(value) => updateSetting('heartRate', 'min', value)}
        onChangeMax={(value) => updateSetting('heartRate', 'max', value)}
        isDarkMode={isDarkMode}
      />
      <SettingSection
        title="SpO2 (%)"
        min={settings.spO2.min}
        max={settings.spO2.max}
        onChangeMin={(value) => updateSetting('spO2', 'min', value)}
        onChangeMax={(value) => updateSetting('spO2', 'max', value)}
        isDarkMode={isDarkMode}
      />
      
      <SettingSection
        title="Humidity (%)"
        min={settings.humidity.min}
        max={settings.humidity.max}
        onChangeMin={(value) => updateSetting('humidity', 'min', value)}
        onChangeMax={(value) => updateSetting('humidity', 'max', value)}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

interface SettingSectionProps {
  title: string;
  min: number;
  max?: number;
  onChangeMin: (value: string) => void;
  onChangeMax?: (value: string) => void;
  isDarkMode: boolean;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  min,
  max,
  onChangeMin,
  onChangeMax,
  isDarkMode,
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
      {title}
    </Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        keyboardType="numeric"
        placeholder="Min"
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        value={min.toString()}
        onChangeText={onChangeMin}
      />
      {onChangeMax && (
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          keyboardType="numeric"
          placeholder="Max"
          placeholderTextColor={isDarkMode ? '#888' : '#666'}
          value={max?.toString()}
          onChangeText={onChangeMax}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  darkText: {
    color: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
  },
  darkInput: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: '#E0E0E0',
  },
});