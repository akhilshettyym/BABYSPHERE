import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import ParentInfo from '../../components/ParentInfo';
import BabyInfo from '../../components/BabyInfo';
import Settings from '../../components/system';

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ParentInfo />
        <BabyInfo />
        <Settings />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

