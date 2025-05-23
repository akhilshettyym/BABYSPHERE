import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Alert, ThresholdSettings } from '../../types/AlertTypes';
import { AlertHistory } from './AlertHistory';
import { SettingsForm } from './SettingsForm';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  alerts: Alert[];
  settings: ThresholdSettings;
  onUpdateSettings: (settings: ThresholdSettings) => void;
  isDarkMode: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  alerts,
  settings,
  onUpdateSettings,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[
        styles.modalContainer,
        isDarkMode && styles.darkModalContainer
      ]}>
        <View style={[
          styles.modalContent,
          isDarkMode && styles.darkModalContent
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.title,
              isDarkMode && styles.darkText
            ]}>
              {activeTab === 'alerts' ? 'Alert History' : 'Settings'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'alerts' && styles.activeTab
              ]}
              onPress={() => setActiveTab('alerts')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'alerts' && styles.activeTabText
              ]}>
                Alerts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'settings' && styles.activeTab
              ]}
              onPress={() => setActiveTab('settings')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'settings' && styles.activeTabText
              ]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'alerts' ? (
            <AlertHistory alerts={alerts} isDarkMode={isDarkMode} />
          ) : (
            <SettingsForm
              settings={settings}
              onSettingsChange={onUpdateSettings}
              isDarkMode={isDarkMode}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  darkModalContent: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#E0E0E0',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9500',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
});