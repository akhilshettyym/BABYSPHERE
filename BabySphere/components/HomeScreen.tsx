"use client"

import { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MoodPicker } from "../components/MoodPicker"
import { SleepQuality } from "../components/SleepQuality"
import type { MoodType } from "../types/wellness"
import { JournalEntry } from "../components/journal/JournalEntry"
import { WellnessInsights } from "../components/insights/WellnessInsights"
import { WellnessTrends } from "../components/trends/WellnessTrends"
import { WellnessTips } from "../components/tips/WellnessTips"

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType>()
  const [sleepQuality, setSleepQuality] = useState(5)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <MoodPicker onMoodSelect={setSelectedMood} selectedMood={selectedMood} />
        <SleepQuality onQualityChange={setSleepQuality} quality={sleepQuality} />
        <JournalEntry />
        <WellnessInsights />
        <WellnessTrends />
        <WellnessTips />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  scrollView: {
    flex: 1,
  },
})