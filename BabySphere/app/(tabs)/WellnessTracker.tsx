import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../../components/HomeScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Wellness Tracker",
          headerStyle: {
            backgroundColor: "#1A1A25",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#FF9500",
          },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}