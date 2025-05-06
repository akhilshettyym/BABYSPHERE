import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LiveFeed from '../../components/LiveFeed';

const LiveFeedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIVE FEED DATA</Text>
      <LiveFeed />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A25',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    textAlign: 'left',
    marginBottom: 20,
  },
});

export default LiveFeedScreen;