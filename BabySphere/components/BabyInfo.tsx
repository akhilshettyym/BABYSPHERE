import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import EditBabyInfoModal from './EditBabyInfoModal';

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [babyInfo, setBabyInfo] = useState<BabyInfoState>({
    name: '',
    dateOfBirth: '',
    gender: '',
    medicalConditions: '',
  });

  const fetchBabyInfo = async () => {
    if (auth.currentUser) {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBabyInfo({
          name: data.baby?.name || '',
          dateOfBirth: data.baby?.dateOfBirth || '',
          gender: data.baby?.gender || '',
          medicalConditions: data.baby?.medicalConditions || '',
        });
      }
    }
  };

  useEffect(() => {
    fetchBabyInfo();
  }, []);

  const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name="baby" size={20} color="#A3D8F4" style={styles.icon} />
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="baby-face-outline" size={24} color="#8AA9B8" />
          <Text style={styles.heading}>Baby Information</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditModalVisible(true)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#8AA9B8" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <InfoRow 
          icon="baby" 
          label="Name" 
          value={babyInfo.name} 
        />
        <InfoRow 
          icon="calendar" 
          label="Date of Birth" 
          value={babyInfo.dateOfBirth ? new Date(babyInfo.dateOfBirth).toLocaleDateString() : 'Not set'} 
        />
        <InfoRow 
          icon="gender-male-female" 
          label="Gender" 
          value={babyInfo.gender} 
        />
        <InfoRow 
          icon="medical-bag" 
          label="Medical Conditions" 
          value={babyInfo.medicalConditions || 'None'} 
        />
      </View>

      <EditBabyInfoModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          fetchBabyInfo(); // Refresh data after modal closes
        }}
        currentInfo={babyInfo}
      />
    </View>
  );
}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8AA9B8',
  },
  editButton: {
    padding: 8,
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