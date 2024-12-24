import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <SettingButton 
        icon="lock-reset" 
        text="Update Password"
        onPress={() => {/* Implement password update logic */}}
      />
      <SettingButton 
        icon="account-edit" 
        text="Edit Profile"
        onPress={() => {/* Implement profile edit logic */}}
      />
      <SettingButton 
        icon="logout" 
        text="Logout"
        variant="danger"
        onPress={handleLogout}
      />
    </View>
  );
}

interface SettingButtonProps {
  icon: string;
  text: string;
  variant?: 'default' | 'danger';
  onPress: () => void;
}

const SettingButton: React.FC<SettingButtonProps> = ({ icon, text, variant = 'default', onPress }) => (
  <TouchableOpacity 
    style={[
      styles.button,
      variant === 'danger' && styles.dangerButton
    ]} 
    onPress={onPress}
  >
    <MaterialCommunityIcons 
      Name={icon} 
      size={20} 
      color={variant === 'danger' ? '#FDC1C5' : '#B4E3A7'} 
    />
    <Text style={[
      styles.buttonText,
      variant === 'danger' && styles.dangerText
    ]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16
  },
  dangerButton: {
    backgroundColor: '#fff0f0'
  },
  dangerText: {
    color: '#FDC1C5'
  }
});

