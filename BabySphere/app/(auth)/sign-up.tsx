"use client"

import { useState } from "react"
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../config/firebaseConfig"
import AuthLayout from "../../components/AuthLayout"
import AuthInput from "../../components/AuthInput"
import AuthButton from "../../components/AuthButton"
import DatePicker from "../../components/DatePicker"
import { Ionicons } from "@expo/vector-icons"
import type { ParentData, BabyData, Errors } from "../../types/auth"

const SignUpScreen = () => {
  const [step, setStep] = useState(1)
  const [parentData, setParentData] = useState<ParentData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [babyData, setBabyData] = useState<BabyData>({
    name: "",
    dateOfBirth: new Date(),
    gender: "",
    medicalConditions: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const validateForm = () => {
    const newErrors: Errors = {}
    if (step === 1) {
      if (!parentData.name) newErrors.name = "Name is required"
      if (!parentData.email) newErrors.email = "Email is required"
      if (!parentData.password) newErrors.password = "Password is required"
      else if (parentData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
      if (parentData.password !== parentData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    } else {
      if (!babyData.name) newErrors.babyName = "Baby's name is required"
      if (!babyData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!babyData.gender) newErrors.gender = "Gender is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, parentData.email, parentData.password)
      await updateProfile(userCredential.user, {
        displayName: parentData.name,
      })

      // Store user data in Firestore
      const userData = {
        parent: {
          name: parentData.name,
          email: parentData.email,
          phone: parentData.phone,
        },
        baby: {
          name: babyData.name,
          dateOfBirth: babyData.dateOfBirth.toISOString(),
          gender: babyData.gender,
          medicalConditions: babyData.medicalConditions,
        },
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", userCredential.user.uid), userData)

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/(auth)/sign-in") },
      ])
    } catch (error) {
      console.error("Error during sign up:", error)
      Alert.alert("Error", "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <>
      <AuthInput
        label="Full Name"
        icon="person-outline"
        value={parentData.name}
        onChangeText={(text) => setParentData({ ...parentData, name: text })}
        placeholder="Enter your full name"
        error={errors.name}
      />
      <AuthInput
        label="Email"
        icon="mail-outline"
        value={parentData.email}
        onChangeText={(text) => setParentData({ ...parentData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter your email"
        error={errors.email}
      />
      <AuthInput
        label="Password"
        icon="lock-closed-outline"
        value={parentData.password}
        onChangeText={(text) => setParentData({ ...parentData, password: text })}
        secureTextEntry
        placeholder="Create a password"
        error={errors.password}
      />
      <AuthInput
        label="Confirm Password"
        icon="lock-closed-outline"
        value={parentData.confirmPassword}
        onChangeText={(text) => setParentData({ ...parentData, confirmPassword: text })}
        secureTextEntry
        placeholder="Confirm your password"
        error={errors.confirmPassword}
      />
      <AuthInput
        label="Phone Number (Optional)"
        icon="call-outline"
        value={parentData.phone}
        onChangeText={(text) => setParentData({ ...parentData, phone: text })}
        keyboardType="phone-pad"
        placeholder="Enter your phone number"
      />
    </>
  )

  const renderStep2 = () => (
    <>
      <AuthInput
        label="Baby's Full Name"
        icon="happy-outline"
        value={babyData.name}
        onChangeText={(text) => setBabyData({ ...babyData, name: text })}
        placeholder="Enter baby's full name"
        error={errors.babyName}
      />
      <View>
        <Text style={styles.label}>Date of Birth</Text>
        <DatePicker
          selectedDate={babyData.dateOfBirth}
          onDateChange={(date) => setBabyData({ ...babyData, dateOfBirth: date })}
        />
        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
      </View>
      <AuthInput
        label="Gender"
        icon="male-female-outline"
        value={babyData.gender}
        onChangeText={(text) => setBabyData({ ...babyData, gender: text })}
        placeholder="Enter baby's gender"
        error={errors.gender}
      />
      <AuthInput
        label="Medical Conditions (Optional)"
        icon="medical-outline"
        value={babyData.medicalConditions}
        onChangeText={(text) => setBabyData({ ...babyData, medicalConditions: text })}
        placeholder="Enter any medical conditions"
        multiline
      />
    </>
  )

  return (
    <AuthLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to monitor your baby</Text>
        </View>

        <View style={styles.stepIndicator}>
          <View style={[styles.step, step === 1 && styles.activeStep]}>
            <Text style={[styles.stepText, step === 1 && styles.activeStepText]}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, step === 2 && styles.activeStep]}>
            <Text style={[styles.stepText, step === 2 && styles.activeStepText]}>2</Text>
          </View>
        </View>

        <View style={styles.form}>
          {step === 1 ? renderStep1() : renderStep2()}

          {step === 1 ? (
            <AuthButton title="Next" onPress={() => validateForm() && setStep(2)} />
          ) : (
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color="#8AA9B8" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <AuthButton title="Sign Up" onPress={handleSignUp} loading={loading} />
            </View>
          )}

          <Text style={styles.linkText} onPress={() => router.push("/(auth)/sign-in")}>
            Already have an account? Sign In
          </Text>
        </View>
      </ScrollView>
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
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#242535",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  activeStep: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  stepText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  activeStepText: {
    color: "#FFFFFF",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#2A2A35",
    marginHorizontal: 8,
  },
  form: {
    gap: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginTop: 4,
  },
})

export default SignUpScreen
