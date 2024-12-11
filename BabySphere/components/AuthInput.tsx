import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
}

const AuthInput = ({ label, icon, error, ...props }: AuthInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#8AA9B8" style={styles.icon} />
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor="#A0AEC0"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#FDC1C5',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AuthInput;