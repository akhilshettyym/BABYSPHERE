import React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type GestureResponderEvent,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface GradientButtonProps {
  onPress: (event: GestureResponderEvent) => void
  colors: [string, string, ...string[]]
  label: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export function GradientButton({
  onPress,
  colors,
  label,
  style,
  textStyle,
}: GradientButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
})