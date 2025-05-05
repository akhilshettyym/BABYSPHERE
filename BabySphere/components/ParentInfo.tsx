"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "../config/firebaseConfig"

interface ParentInfoState {
  name: string
  email: string
  phone: string
}

export default function ParentInfo() {
  const [parentInfo, setParentInfo] = useState<ParentInfoState>({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const fetchParentInfo = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setParentInfo({
            name: data.parent.name || "",
            email: data.parent.email || "",
            phone: data.parent.phone || "",
          })
        }
      }
    }

    fetchParentInfo()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{parentInfo.name}</Text>
        <View style={styles.contactItem}>
          <MaterialCommunityIcons name="email-outline" size={16} color="#8AA9B8" />
          <Text style={styles.contactText}>{parentInfo.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialCommunityIcons name="phone-outline" size={16} color="#8AA9B8" />
          <Text style={styles.contactText}>{parentInfo.phone || "Not provided"}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  imageContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FF9500",
  },
  infoContainer: {
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
})