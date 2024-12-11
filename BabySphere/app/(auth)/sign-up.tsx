import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import AuthLayout from '../../components/AuthLayout';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/(auth)/sign-in') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            error={errors.name}
          />

          <AuthInput
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
            error={errors.email}
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Create a password"
            error={errors.password}
          />

          <AuthButton
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
          />

          <Text
            style={styles.linkText}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            Already have an account? Sign In
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  form: {
    gap: 16,
  },
  linkText: {
    color: '#A3D8F4',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SignUpScreen;