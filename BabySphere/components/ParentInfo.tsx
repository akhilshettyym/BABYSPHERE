import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth, storage } from '../config/firebaseConfig'; // Ensure `storage` is initialized for Firebase Storage
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface BabyInfoState {
  name: string;
  dateOfBirth: string;
  gender: string;
  medicalConditions: string;
  profilePic: string; // Added profilePic to hold the image URL
}

export default function BabyInfo() {
  const [babyInfo, setBabyInfo] = useState<BabyInfoState>({
    name: '',
    dateOfBirth: '',
    gender: '',
    medicalConditions: '',
    profilePic: '',
  });

  useEffect(() => {
    const fetchBabyInfo = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBabyInfo({
            name: data.baby.name || '',
            dateOfBirth: data.baby.dateOfBirth || '',
            gender: data.baby.gender || '',
            medicalConditions: data.baby.medicalConditions || '',
            profilePic: data.baby.profilePic || '', // Fetch the profile picture if available
          });
        }
      }
    };

    fetchBabyInfo();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0]; // Access the URI from the first asset
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a reference in Firebase Storage
        const storageRef = ref(storage, `profilePictures/${userId}`);
        await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Update the Firestore document with the image URL
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          'baby.profilePic': downloadURL,
        });

        // Update the state to display the image
        setBabyInfo((prevState) => ({
          ...prevState,
          profilePic: downloadURL,
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {babyInfo.profilePic ? (
          <Image source={{ uri: babyInfo.profilePic }} style={styles.profileImage} />
        ) : (
          <MaterialCommunityIcons name="camera" size={64} color="#A3D8F4" />
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <InfoRow icon="baby" label="Name" value={babyInfo.name} />
        <InfoRow icon="calendar" label="Date of Birth" value={new Date(babyInfo.dateOfBirth).toLocaleDateString()} />
        <InfoRow icon="gender-male-female" label="Gender" value={babyInfo.gender} />
        <InfoRow icon="medical-bag" label="Medical Conditions" value={babyInfo.medicalConditions || 'None'} />
      </View>
    </View>
  );
}
interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
  }
  const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons Name={icon} size={20} color="#A3D8F4" style={styles.icon} />
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#A3D8F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 24,
  },
  label: {
    fontSize: 12,
    color: '#8AA9B8',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#A3D8F4',
    fontWeight: '500',
  },
});
