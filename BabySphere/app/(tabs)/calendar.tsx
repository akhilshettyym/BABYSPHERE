"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StyleSheet, Text, Alert, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db, auth } from "../../config/firebaseConfig"
import { CalendarView } from "../../components/CalendarView"
import { EventList } from "../../components/EventList"
import { AddEventButton } from "../../components/AddEventButton"
import type { Event, User } from "../../types/types"

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [events, setEvents] = useState<Event[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, displayName: user.displayName })
        fetchUserEvents(user.uid)
      } else {
        setCurrentUser(null)
      }
    })

    return unsubscribe
  }, [])

  const fetchUserEvents = (userId: string) => {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("userId", "==", userId))

    onSnapshot(q, (snapshot) => {
      const fetchedEvents: Event[] = []
      snapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event)
      })
      setEvents(fetchedEvents)
    })
  }

  const addEvent = async (newEvent: Omit<Event, "id" | "createdAt">) => {
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to add events.")
      return
    }

    try {
      const eventsRef = collection(db, "events")
      const createdAt = new Date().toISOString()
      const docRef = await addDoc(eventsRef, {
        ...newEvent,
        userId: currentUser.uid,
        createdAt,
      })
      const addedEvent: Event = { id: docRef.id, ...newEvent, createdAt }
      setEvents([...events, addedEvent])
      Alert.alert("Event Added", `Event "${newEvent.title}" added for ${newEvent.date}`)
      setIsAddEventModalVisible(false)
    } catch (error) {
      console.error("Error adding event: ", error)
      Alert.alert("Error", "Could not add event.")
    }
  }

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const eventRef = doc(db, "events", updatedEvent.id)
      await updateDoc(eventRef, updatedEvent as { [x: string]: any })
      setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
      Alert.alert("Event Updated", `Event "${updatedEvent.title}" has been updated.`)
    } catch (error) {
      console.error("Error updating event: ", error)
      Alert.alert("Error", "Could not update event.")
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, "events", eventId)
      await deleteDoc(eventRef)
      setEvents(events.filter((event) => event.id !== eventId))
      Alert.alert("Event Deleted", "The event has been successfully deleted.")
    } catch (error) {
      console.error("Error deleting event: ", error)
      Alert.alert("Error", "Could not delete event.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>BABY MONITOR</Text>
      </View>

      <View style={styles.content}>
        <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} events={events} />
        <EventList
          events={events.filter((event) => event.date === selectedDate)}
          onUpdateEvent={updateEvent}
          onDeleteEvent={deleteEvent}
        />
        <AddEventButton
          onAddEvent={addEvent}
          selectedDate={selectedDate}
          isVisible={isAddEventModalVisible}
          setIsVisible={setIsAddEventModalVisible}
          userId={currentUser?.uid}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A25",
  },
  fixedHeader: {
    height: 60,
    backgroundColor: "#1A1A25",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "left",
  },
  content: {
    flex: 1,
    padding: 20,
  },
})

export default CalendarScreen;