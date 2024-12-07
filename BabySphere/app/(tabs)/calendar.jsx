import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const CalendarScreen = () => {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [markedDates, setMarkedDates] = useState(() => {
    const today = getToday();
    return {
      [today]: {
        selected: true,
        selectedColor: "#FDC1C5", // Highlight color for today
      },
    };
  });

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    // Update markedDates
    setMarkedDates({
      ...markedDates,
      [selectedDate]: { selected: true, selectedColor: "green" },
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
