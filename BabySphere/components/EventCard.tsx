import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types/types';

interface EventCardProps {
  event: Event;
  onUpdate: (updatedFields: Partial<Event>) => void;
  onDelete: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedDescription, setEditedDescription] = useState(event.description);

  const handlePriorityChange = () => {
    const priorities: Array<Event['priority']> = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(event.priority);
    const newPriority = priorities[(currentIndex + 1) % priorities.length];
    onUpdate({ priority: newPriority });
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    onUpdate({ title: editedTitle, description: editedDescription });
    setIsEditModalVisible(false);
  };

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor(event.priority) }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>Event Time: {event.time}</Text>
        <Text style={styles.time}>Notification Time: {event.notificationTime}</Text>
        <Text style={styles.time}>Created: {new Date(event.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.priorityButton} onPress={handlePriorityChange}>
          <Text style={styles.priorityText}>{event.priority}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil-outline" size={24} color="#8AA9B8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Event</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Event Title"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Event Description"
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getPriorityColor = (priority: Event['priority']) => {
  switch (priority) {
    case 'high':
      return '#FF6B6B';
    case 'medium':
      return '#FFD93D';
    case 'low':
      return '#6BCB77';
    default:
      return '#B4E3A7';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8AA9B8',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#8AA9B8',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priorityButton: {
    backgroundColor: '#B4E3A7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  priorityText: {
    color: '#8AA9B8',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  editButton: {
    padding: 4,
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  saveButton: {
    backgroundColor: '#6BCB77',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

