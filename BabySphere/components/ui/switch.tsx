import React from 'react'
import { View, Switch as RNSwitch, Text, StyleSheet } from 'react-native'

interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  label: string
}

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNSwitch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
})

