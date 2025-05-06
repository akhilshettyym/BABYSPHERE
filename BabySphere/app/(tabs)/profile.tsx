import { ScrollView, StyleSheet, SafeAreaView, Text, View } from "react-native"
import ParentInfo from "../../components/ParentInfo"
import BabyInfo from "../../components/BabyInfo"
import Settings from "../../components/system"
import LogoutButton from "../../components/LogoutButton"

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>MY PROFILE</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ height: 60 }} /> 
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
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "left",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
})
