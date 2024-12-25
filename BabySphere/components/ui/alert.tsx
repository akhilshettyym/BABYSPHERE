import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'info':
        return styles.info
      case 'success':
        return styles.success
      case 'warning':
        return styles.warning
      case 'error':
        return styles.error
      default:
        return styles.info
    }
  }

  const getIconName = () => {
    switch (type) {
      case 'info':
        return 'information-circle'
      case 'success':
        return 'checkmark-circle'
      case 'warning':
        return 'warning'
      case 'error':
        return 'alert-circle'
      default:
        return 'information-circle'
    }
  }

  return (
    <View style={[styles.container, getAlertStyle()]}>
      <Ionicons name={getIconName()} size={24} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  info: {
    backgroundColor: '#3498db',
  },
  success: {
    backgroundColor: '#2ecc71',
  },
  warning: {
    backgroundColor: '#f39c12',
  },
  error: {
    backgroundColor: '#e74c3c',
  },
})

