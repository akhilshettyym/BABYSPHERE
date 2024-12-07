import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth } from "../../config/firebaseConfig"; // Adjust path
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    // Alert.alert("Alert Title", "This is the message.");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserEvents(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  // Fetch events for the logged-in user
  const fetchUserEvents = async (userId) => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("userId", "==", userId));

    onSnapshot(q, (snapshot) => {
      const events = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        events[data.date] = { marked: true, dotColor: "blue" };
      });
      setMarkedDates(events);
    });
  };

  // Add a new event to Firestore
  const addEvent = async (date) => {
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to add events.");
      return;
    }

    try {
      const eventsRef = collection(db, "events");
      await addDoc(eventsRef, {
        userId: currentUser.uid,
        date,
        title: "New Event", // Customize as needed
      });
      Alert.alert("Event Added", `Event added for ${date}`);
    } catch (error) {
      console.error("Error adding event: ", error);
      Alert.alert("Error", "Could not add event.");
    }
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    addEvent(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: "#FDC1C5",
          arrowColor: "#FDC1C5",
          selectedDayBackgroundColor: "#FDC1C5",
          dotColor: "#FDC1C5",
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 16,
  },
});

export default CalendarScreen;
