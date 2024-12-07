import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>BabyMonitor</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#8AA9B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#A3D8F4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8AA9B8',
  },
  menuButton: {
    padding: 5,
  },
});

export default NewHeader;

