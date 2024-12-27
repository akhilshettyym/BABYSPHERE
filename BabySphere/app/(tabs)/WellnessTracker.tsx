import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../components/HomeScreen';
import { theme } from '../../utils/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Wellness Tracker',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text,
          },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
