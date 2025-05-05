import { TextInput, Text, View, StyleSheet, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface AuthInputProps extends TextInputProps {
  label: string
  icon: keyof typeof Ionicons.glyphMap
  error?: string
}

const AuthInput = ({ label, icon, error, ...props }: AuthInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#8AA9B8" style={styles.icon} />
        <TextInput {...props} style={styles.input} placeholderTextColor="#A0AEC0" />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242535",
    borderWidth: 1,
    borderColor: "#2A2A35",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
  },
})

export default AuthInput