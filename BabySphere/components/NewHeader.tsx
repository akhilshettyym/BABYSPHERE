import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const NewHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>BABYSPHERE</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A25",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500",
  },
  menuButton: {
    padding: 5,
  },
})

export default NewHeader