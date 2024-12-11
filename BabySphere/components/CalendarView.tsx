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
        selectedColor: '#FDC1C5',
      };
    }
    acc[event.date].dots.push({ color: getPriorityColor(event.priority) });
    return acc;
  }, {} as { [key: string]: { marked: boolean; dots: { color: string }[]; selected?: boolean; selectedColor?: string } });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#FDC1C5',
    };
  }

  return (
    <Calendar
      onDayPress={(day: DateData) => onSelectDate(day.dateString)}
      markedDates={markedDates}
      markingType="multi-dot"
      theme={{
        backgroundColor: '#D1C4E9',
        calendarBackground: '#D1C4E9',
        textSectionTitleColor: '#8AA9B8',
        selectedDayBackgroundColor: '#FDC1C5',
        selectedDayTextColor: '#8AA9B8',
        todayTextColor: '#B4E3A7',
        dayTextColor: '#8AA9B8',
        textDisabledColor: '#d9e1e8',
        dotColor: '#B4E3A7',
        selectedDotColor: '#8AA9B8',
        arrowColor: '#B4E3A7',
        monthTextColor: '#8AA9B8',
        indicatorColor: '#B4E3A7',
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
      return '#FF0000';
    case 'medium':
      return '#FFA500';
    case 'low':
      return '#00FF00';
    default:
      return '#B4E3A7';
  }
};

const styles = StyleSheet.create({});

