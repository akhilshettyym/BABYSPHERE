import { ScrollView, StyleSheet, SafeAreaView, Text, View } from "react-native"
import ParentInfo from "../../components/ParentInfo"
import BabyInfo from "../../components/BabyInfo"
import Settings from "../../components/system"
import LogoutButton from "../../components/LogoutButton"

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MY PROFILE</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ParentInfo />
        <BabyInfo />
        <Settings />
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500", // Accent color
    textAlign: "left",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
})