import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const onDayPress = (day: any) => {
    onDateChange(new Date(day.timestamp));
    setCalendarVisible(false);
  };

  const selectToday = () => {
    onDateChange(new Date());
    setCalendarVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
        <Ionicons name="calendar" size={24} color="#8AA9B8" />
      </TouchableOpacity>
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate.toISOString()}
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#B4E3A7' },
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#8AA9B8',
                selectedDayBackgroundColor: '#B4E3A7',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#B4E3A7',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
              }}
            />
            <TouchableOpacity style={styles.todayButton} onPress={selectToday}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Ionicons name="close" size={24} color="#8AA9B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#8AA9B8',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  todayButton: {
    backgroundColor: '#B4E3A7',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default DatePicker;

