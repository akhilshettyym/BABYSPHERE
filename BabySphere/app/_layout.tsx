"use client"

import { Stack } from "expo-router"
import { useEffect } from "react"
import { useSegments, useRouter } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebaseConfig"

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === "(auth)"
      const inOnboarding = segments[0] === "onboarding" as unknown as string

      if (user && (inAuthGroup || inOnboarding)) {
        
        router.replace("/(tabs)/HomePage")
      } else if (!user && !inAuthGroup && !inOnboarding) {
        
        router.replace("./onboarding")
      }
    })

    return () => unsubscribe()
  }, [segments, router])

  return <Stack screenOptions={{ headerShown: false }} />
}