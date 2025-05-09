import type React from "react"
import { StyleSheet, View, Text, SafeAreaView } from "react-native"
import LiveFeed from "../../components/LiveFeed"

const LiveFeedScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>LIVE FEED DATA</Text>
      </View>

      <View style={styles.content}>
        <LiveFeed />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  fixedHeader: {
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "left",
  },
  content: {
    flex: 1,
    padding: 10,
  },
})

export default LiveFeedScreen;