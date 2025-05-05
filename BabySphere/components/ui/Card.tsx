import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { theme } from "../../utils/theme"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.container, style]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242535",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    ...theme.shadows.card,
  },
})
