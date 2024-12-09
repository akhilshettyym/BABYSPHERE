import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventCardProps, Event } from '../types/types';

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate }) => {
  const handlePriorityChange = () => {
    const priorities: Array<Event['priority']> = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(event.priority);
    const newPriority = priorities[(currentIndex + 1) % priorities.length];
    onUpdate({ ...event, priority: newPriority });
  };

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor(event.priority) }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>{event.time}</Text>
      </View>
      <TouchableOpacity style={styles.priorityButton} onPress={handlePriorityChange}>
        <Text style={styles.priorityText}>{event.priority}</Text>
      </TouchableOpacity>
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
  priorityButton: {
    backgroundColor: '#B4E3A7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: '#8AA9B8',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

