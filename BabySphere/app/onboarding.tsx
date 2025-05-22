"use client"

import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebaseConfig"

export default function OnboardingScreen() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/HomePage")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleGetStarted = () => {
    router.push("/(auth)/sign-in")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>

        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/logo.png")} style={styles.logoIcon} />
          <Text style={styles.logoText}>BABYSPHERE</Text>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/cards.png")} style={styles.image} resizeMode="contain" />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            Discover Endless{"\n"}
            Possibilities with{"\n"}
            <Text style={styles.highlight}>BABYSPHERE</Text>
          </Text>
          <Image
            source={require("../assets/images/path.png")}
            style={{ width: 100, height: 20, resizeMode: "contain" }}
          />

          {/* <View style={styles.underline} /> */}
          <Text style={styles.subheading}>
            Peace of Mind for Every Parent: Baby Health in{"\n"}
            the Palm of Your Hand.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "center",
    paddingTop: 20,
  },  
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  }, 
  logoText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 34,
  },
  highlight: {
    color: "#FF9500",
  },
  highlights: {
    color: "#FF9500",
    fontSize: 32,
    paddingTop: 20,
    fontWeight: "bold",
  },
  underline: {
    width: 120,
    height: 3,
    backgroundColor: "#FF9500",
    marginTop: 5,
    marginLeft: 60,
  },
  subheading: {
    color: "#FFFFFF",
    opacity: 0.7,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FF9500",
    width: "100%",
    paddingBottom: 15,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
})