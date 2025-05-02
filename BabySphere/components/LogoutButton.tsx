"use client"

import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebaseConfig"
import { useRouter } from "expo-router"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut(auth)
              router.replace("../onboarding")
            } catch (error) {
              console.error("Error signing out: ", error)
              Alert.alert("Error", "Failed to sign out. Please try again.")
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "#FDC1C5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
})