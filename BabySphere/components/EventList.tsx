import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Event } from '../types/types';
import { EventCard } from './EventCard';

interface EventListProps {
  events: Event[];
  onUpdateEvent: (updatedEvent: Event) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
}

export const EventList: React.FC<EventListProps> = ({ events, onUpdateEvent, onDeleteEvent }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onUpdate={(updatedEvent) => onUpdateEvent({ ...item, ...updatedEvent })}
            onDelete={() => onDeleteEvent(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No events for this date</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8AA9B8',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8AA9B8',
    fontSize: 16,
  },
});