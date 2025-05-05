import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"

interface AuthButtonProps {
  onPress: () => void
  title: string
  loading?: boolean
}

const AuthButton = ({ onPress, title, loading }: AuthButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default AuthButton