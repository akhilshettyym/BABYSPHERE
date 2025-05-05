"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { Calendar } from "react-native-calendars"
import { Ionicons } from "@expo/vector-icons"

interface DatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false)

  const onDayPress = (day: any) => {
    onDateChange(new Date(day.timestamp))
    setCalendarVisible(false)
  }

  const selectToday = () => {
    onDateChange(new Date())
    setCalendarVisible(false)
  }

  return (
    <View>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setCalendarVisible(true)}>
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
        <Ionicons name="calendar" size={24} color="#FF9500" />
      </TouchableOpacity>
      <Modal visible={isCalendarVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate.toISOString()}
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate.toISOString().split("T")[0]]: { selected: true, selectedColor: "#FF9500" },
              }}
              theme={{
                backgroundColor: "#242535",
                calendarBackground: "#242535",
                textSectionTitleColor: "#FFFFFF",
                selectedDayBackgroundColor: "#FF9500",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: "#FF9500",
                dayTextColor: "#FFFFFF",
                textDisabledColor: "rgba(255, 255, 255, 0.3)",
                arrowColor: "#FF9500",
              }}
            />
            <TouchableOpacity style={styles.todayButton} onPress={selectToday}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCalendarVisible(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#242535",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  dateText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  calendarContainer: {
    backgroundColor: "#242535",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  todayButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
})

export default DatePicker