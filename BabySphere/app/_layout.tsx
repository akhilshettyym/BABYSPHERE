import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [loaded, error] = useFonts({
    // Add your custom fonts here if needed
    // For example:
    // 'Inter-Bold': require('../assets/fonts/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (error) console.error('Font loading error:', error);
  }, [error]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn('Error in prepare:', e);
      }
    }
    prepare();
  }, [loaded]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ title: 'Profile' }} 
          />
        </>
      ) : (
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
      )}
    </Stack>
  );
}

