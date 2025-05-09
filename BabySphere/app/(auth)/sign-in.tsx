"use client"

import { useState } from "react"
import { StyleSheet, Text, View, Alert } from "react-native"
import { router } from "expo-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebaseConfig"
import AuthLayout from "../../components/AuthLayout"
import AuthInput from "../../components/AuthInput"
import AuthButton from "../../components/AuthButton"

const SignInScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })

  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    }
    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Navigation will be handled by auth state listener
    } catch (error) {
      Alert.alert("Error", "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
            error={errors.email}
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            error={errors.password}
          />

          <AuthButton title="Sign In" onPress={handleSignIn} loading={loading} />

          <Text style={styles.linkText} onPress={() => router.push("/(auth)/sign-up")}>
            Don't have an account? Sign Up
          </Text>
        </View>
      </View>
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF9500",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  form: {
    gap: 16,
  },
  linkText: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
})

export default SignInScreen;