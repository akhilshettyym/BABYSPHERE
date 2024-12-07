import React, { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({
    "2024-12-10": { marked: true, dotColor: "blue", activeOpacity: 0.5 },
  });

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    // Update markedDates
    setMarkedDates({
      ...markedDates,
      [selectedDate]: { marked: true, dotColor: "green" },
    });

    Alert.alert("Date Selected", `You marked ${selectedDate} on the calendar.`);
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
