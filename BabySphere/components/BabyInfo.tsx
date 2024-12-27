import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

interface BabyInfoState {
  name: string;
  dateOfBirth: string;
  gender: string;
  medicalConditions: string;
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

export default function BabyInfo() {
  const [babyInfo, setBabyInfo] = useState<BabyInfoState>({
    name: '',
    dateOfBirth: '',
    gender: '',
    medicalConditions: '',
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
          });
        }
      }
    };

    fetchBabyInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="baby-face-outline" size={24} color="#8AA9B8" />
        <Text style={styles.heading}>Baby Information</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8AA9B8',
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
