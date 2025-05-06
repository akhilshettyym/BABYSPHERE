import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LiveFeed from '../../components/LiveFeed';

const LiveFeedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LIVE FEED DATA</Text>
      </View>
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
  header: {
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9500',
    textAlign: 'left',
  },
});

export default LiveFeedScreen;