import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (user && inAuthGroup) {
        // Redirect authenticated users to the home page if they're on an auth page
        router.replace('/(tabs)/HomePage');
      } else if (!user && !inAuthGroup) {
        // Redirect unauthenticated users to the sign-in page
        router.replace('/(auth)/sign-in');
      }
    });
  }, [segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}