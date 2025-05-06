import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const NewHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>BABYSPHERE</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
  },
  menuButton: {
    padding: 2,
  },
})

export default NewHeader