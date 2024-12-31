import React from 'react';
import { View, StyleSheet } from 'react-native';
import PasswordReset from './PasswordReset';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      {/* ... existing settings ... */}
      <PasswordReset />
    </View>
  );
};

export default SettingsScreen;