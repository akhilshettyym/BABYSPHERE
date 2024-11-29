import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text,  ScrollView, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants/images";
import CustomButton from "../../components/CustomButton";

const { width } = Dimensions.get("window");

const Welcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Logo */}
          
          {/* Illustration */}
          

          {/* Main Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text style={styles.highlight}>BABYSPHERE</Text>
            </Text>
            
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Peace of Mind for Every Parent: Baby Health in the Palm of Your Hand.
          </Text>

          {/* Continue Button */}
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles={styles.button}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  
  illustration: {
    width: "100%",
    maxWidth: 380,
    height: width * 0.8, // Maintain aspect ratio
    marginBottom: 20,
  },
  headingContainer: {
    position: "relative",
    marginTop: 10,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
  highlight: {
    color: "#FDC1C5", // Accent color
  },
  path: {
    position: "absolute",
    width: 136,
    height: 15,
    bottom: -8,
    right: -8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#8AA9B8", // Grayish Blue from your color palette
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});

export default Welcome;
