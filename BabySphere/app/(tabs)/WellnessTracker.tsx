import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../../components/HomeScreen"
import { View, Text, StyleSheet } from "react-native"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => (
            <View style={styles.fixedHeader}>
              <Text style={styles.title}>WELLNESS TRACKER</Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  fixedHeader: {
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "left",
  },
})