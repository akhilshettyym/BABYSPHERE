import type React from "react"
import { View, StyleSheet, Image, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { height } = useWindowDimensions()

  return (
    <LinearGradient colors={["#A3D8F4", "#F8F9FA"]} style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/logo.png")}
          style={[styles.image, { height: height * 0.27 }]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    alignItems: "center",
  },
  image: {
    width: "40%",
  },
  content: {
    flex: 1,
    backgroundColor: "#1A1A25",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
})

export default AuthLayout