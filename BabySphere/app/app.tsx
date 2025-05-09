import { StrictMode } from 'react';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import LandingPage from './(auth)/landing';
import SignInScreen from './(auth)/sign-in';
import SignUpScreen from './(auth)/sign-up';
import HomePage from './(tabs)/HomePage';
import { User } from 'firebase/auth';

export type RootStackParamList = {
  landing: undefined;
  'sign-in': undefined;
  'sign-up': undefined;
  HomePage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
    const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <StrictMode>
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="landing" component={LandingPage} options={{ headerShown: false }} />
            <Stack.Screen name="sign-in" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </StrictMode>
  );
}

export default App;