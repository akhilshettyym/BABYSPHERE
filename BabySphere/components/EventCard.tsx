import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types/types';

interface EventCardProps {
  event: Event;
  onUpdate: (updatedEvent: Partial<Event>) => void;
  onDelete: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
  const handlePriorityChange = () => {
    const priorities: Array<Event['priority']> = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(event.priority);
    const newPriority = priorities[(currentIndex + 1) % priorities.length];
    onUpdate({ priority: newPriority });
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
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getPriorityColor = (priority: Event['priority']) => {
  switch (priority) {
    case 'high':
      return '#FF0000';
    case 'medium':
      return '#FFA500';
    case 'low':
      return '#00FF00';
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
  deleteButton: {
    padding: 4,
  },
});