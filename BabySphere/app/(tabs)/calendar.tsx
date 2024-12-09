import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { CalendarView } from '../../components/CalendarView';
import { EventList } from '../../components/EventList';
import { AddEventButton } from '../../components/AddEventButton';
import { Event, User } from '../../types/types';

interface EventListProps {
  events: Event[];
  onUpdateEvent: (updatedEvent: Event) => Promise<void>;
}

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, displayName: user.displayName });
        fetchUserEvents(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserEvents = (userId: string) => {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('userId', '==', userId));

    onSnapshot(q, (snapshot) => {
      const fetchedEvents: Event[] = [];
      snapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(fetchedEvents);
    });
  };

  const addEvent = async (newEvent: Omit<Event, 'id' | 'createdAt'>) => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to add events.');
      return;
    }

    try {
      const eventsRef = collection(db, 'events');
      const createdAt = new Date().toISOString();
      const docRef = await addDoc(eventsRef, {
        ...newEvent,
        userId: currentUser.uid,
        createdAt,
      });
      const addedEvent: Event = { id: docRef.id, ...newEvent, createdAt };
      setEvents([...events, addedEvent]);
      Alert.alert('Event Added', `Event "${newEvent.title}" added for ${newEvent.date}`);
    } catch (error) {
      console.error('Error adding event: ', error);
      Alert.alert('Error', 'Could not add event.');
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const eventRef = doc(db, 'events', updatedEvent.id);
      await updateDoc(eventRef, updatedEvent as { [x: string]: any });
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      Alert.alert('Event Updated', `Event "${updatedEvent.title}" has been updated.`);
    } catch (error) {
      console.error('Error updating event: ', error);
      Alert.alert('Error', 'Could not update event.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Baby Monitor</Text>
      <CalendarView
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        events={events}
      />
      <EventList
        events={events.filter((event) => event.date === selectedDate)}
        onUpdateEvent={updateEvent}
      />
      <AddEventButton onAddEvent={addEvent} selectedDate={selectedDate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3D8F4',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8AA9B8',
    marginBottom: 16,
  },
});

export default CalendarScreen;

