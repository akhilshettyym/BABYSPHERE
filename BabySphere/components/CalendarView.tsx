import React from 'react';
import { StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Event } from '../types/types';

interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: Event[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onSelectDate, events }) => {
  const markedDates = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = {
        marked: true,
        dots: [],
        selected: event.date === selectedDate,
        selectedColor: '#E0E0E0',
      };
    }
    acc[event.date].dots.push({ color: getPriorityColor(event.priority) });
    return acc;
  }, {} as { [key: string]: { marked: boolean; dots: { color: string }[]; selected?: boolean; selectedColor?: string } });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#E0E0E0',
    };
  }

  return (
    <Calendar
      onDayPress={(day: DateData) => onSelectDate(day.dateString)}
      markedDates={markedDates}
      markingType="multi-dot"
      theme={{
        backgroundColor: '#FFFFFF',
        calendarBackground: '#FFFFFF',
        textSectionTitleColor: '#757575',
        selectedDayBackgroundColor: '#E0E0E0',
        selectedDayTextColor: '#000000',
        todayTextColor: '#1976D2',
        dayTextColor: '#212121',
        textDisabledColor: '#BDBDBD',
        dotColor: '#1976D2',
        selectedDotColor: '#1976D2',
        arrowColor: '#757575',
        monthTextColor: '#212121',
        indicatorColor: '#1976D2',
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
    />
  );
};

const getPriorityColor = (priority: Event['priority']) => {
  switch (priority) {
    case 'high':
      return '#F44336';
    case 'medium':
      return '#FFA000';
    case 'low':
      return '#4CAF50';
    default:
      return '#1976D2';
  }
};
const styles = StyleSheet.create({});

