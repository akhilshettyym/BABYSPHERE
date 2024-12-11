import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodTracker } from '../components/MoodTracker';
import { EnergyTracker } from '../components/EnergyTracker';
import { WellnessInsights } from '../components/WellnessInsights';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { colors } from '../utils/colors';
import type { MoodType } from '../types/wellness';

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType>();
  const [energyLevel, setEnergyLevel] = useState(5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <MoodTracker
          onMoodSelect={setSelectedMood}
          selectedMood={selectedMood}
        />
        <EnergyTracker
          onEnergySelect={setEnergyLevel}
          energyLevel={energyLevel}
        />
        <WellnessInsights />
        <RecommendationsCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    padding: 16,
  },
});