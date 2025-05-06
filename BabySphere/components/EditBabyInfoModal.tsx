import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EditBabyInfoModalProps {
  visible: boolean;
  onClose: () => void;
  currentInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    medicalConditions: string;
  };
}

export default function EditBabyInfoModal({ visible, onClose, currentInfo }: EditBabyInfoModalProps) {
  const [babyInfo, setBabyInfo] = useState(currentInfo);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdate = async () => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          'baby.name': babyInfo.name,
          'baby.dateOfBirth': babyInfo.dateOfBirth,
          'baby.gender': babyInfo.gender,
          'baby.medicalConditions': babyInfo.medicalConditions,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating baby info:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBabyInfo(prev => ({
        ...prev,
        dateOfBirth: selectedDate.toISOString(),
      }));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.heading}>Edit Baby Information</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#8AA9B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={babyInfo.name}
                onChangeText={(text) => setBabyInfo(prev => ({ ...prev, name: text }))}
                placeholder="Enter baby's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>
                  {babyInfo.dateOfBirth 
                    ? new Date(babyInfo.dateOfBirth).toLocaleDateString()
                    : 'Select date of birth'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={babyInfo.dateOfBirth ? new Date(babyInfo.dateOfBirth) : new Date()}
                  mode="date"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={babyInfo.gender}
                onChangeText={(text) => setBabyInfo(prev => ({ ...prev, gender: text }))}
                placeholder="Enter gender"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical Conditions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={babyInfo.medicalConditions}
                onChangeText={(text) => setBabyInfo(prev => ({ ...prev, medicalConditions: text }))}
                multiline
                numberOfLines={3}
                placeholder="Enter medical conditions (if any)"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update Information</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A25',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9500',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#2A2A3C',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});