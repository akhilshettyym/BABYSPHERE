import type React from "react"
import { StyleSheet } from "react-native"
import { Calendar, type DateData } from "react-native-calendars"
import type { Event } from "../types/types"

interface CalendarViewProps {
  selectedDate: string
  onSelectDate: (date: string) => void
  events: Event[]
}

export const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onSelectDate, events }) => {
  const markedDates = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = {
          marked: true,
          dots: [],
          selected: event.date === selectedDate,
          selectedColor: "#FF9500",
        }
      }
      acc[event.date].dots.push({ color: getPriorityColor(event.priority) })
      return acc
    },
    {} as { [key: string]: { marked: boolean; dots: { color: string }[]; selected?: boolean; selectedColor?: string } },
  )

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#FF9500",
    }
  }

  return (
    <Calendar
      onDayPress={(day: DateData) => onSelectDate(day.dateString)}
      markedDates={markedDates}
      markingType="multi-dot"
      theme={{
        backgroundColor: "#242535",
        calendarBackground: "#242535",
        textSectionTitleColor: "#FFFFFF",
        selectedDayBackgroundColor: "#FF9500",
        selectedDayTextColor: "#FFFFFF",
        todayTextColor: "#FF9500",
        dayTextColor: "#FFFFFF",
        textDisabledColor: "rgba(255, 255, 255, 0.3)",
        dotColor: "#FF9500",
        selectedDotColor: "#FFFFFF",
        arrowColor: "#FF9500",
        monthTextColor: "#FFFFFF",
        indicatorColor: "#FF9500",
        textDayFontFamily: "System",
        textMonthFontFamily: "System",
        textDayHeaderFontFamily: "System",
        textDayFontWeight: "300",
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "300",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
    />
  )
}

const getPriorityColor = (priority: Event["priority"]) => {
  switch (priority) {
    case "high":
      return "#FF6B6B"
    case "medium":
      return "#FFD93D"
    case "low":
      return "#6BCB77"
    default:
      return "#FF9500"
  }
}
const styles = StyleSheet.create({})