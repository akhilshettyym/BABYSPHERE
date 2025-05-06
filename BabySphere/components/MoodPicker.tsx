import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import type { MoodType } from "../types/wellness"

interface MoodPickerProps {
  onMoodSelect: (mood: MoodType) => void
  selectedMood?: MoodType
}

export function MoodPicker({ onMoodSelect, selectedMood }: MoodPickerProps) {
  const moods: { type: MoodType; emoji: string; label: string }[] = [
    { type: "happy", emoji: "😊", label: "Happy" },
    { type: "content", emoji: "😌", label: "Content" },
    { type: "neutral", emoji: "😐", label: "Neutral" },
    { type: "sad", emoji: "😔", label: "Sad" },
    { type: "Tired", emoji: "😫", label: "Tired" },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodGrid}>
        {moods.map(({ type, emoji, label }) => (
          <TouchableOpacity
            key={type}
            style={[styles.moodButton, selectedMood === type && styles.selectedMood]}
            onPress={() => onMoodSelect(type)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },  
  moodButton: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: "#242535",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  selectedMood: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
})