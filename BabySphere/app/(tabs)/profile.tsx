import { ScrollView, StyleSheet, SafeAreaView } from "react-native"
import ParentInfo from "../../components/ParentInfo"
import BabyInfo from "../../components/BabyInfo"
import Settings from "../../components/system"
import LogoutButton from "../../components/LogoutButton"

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
})