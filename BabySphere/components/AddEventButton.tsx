"use client"

import type React from "react"
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import type { Event } from "../types/types"

export interface AddEventButtonProps {
  onAddEvent: (newEvent: Omit<Event, "id" | "createdAt">) => Promise<void>
  selectedDate: string
  isVisible: boolean
  setIsVisible: Dispatch<SetStateAction<boolean>>
  userId: string | undefined
}

export const AddEventButton: React.FC<AddEventButtonProps> = ({ onAddEvent, selectedDate, userId }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date(selectedDate))
  const [time, setTime] = useState(new Date())
  const [notificationTime, setNotificationTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false)
  const [priority, setPriority] = useState<Event["priority"]>("low")
  const [titleError, setTitleError] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [timeAmPm, setTimeAmPm] = useState<"AM" | "PM">("AM")
  const [notificationTimeAmPm, setNotificationTimeAmPm] = useState<"AM" | "PM">("AM")

  const [dateString, setDateString] = useState(date.toLocaleDateString())
  const [timeString, setTimeString] = useState(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  const [notificationTimeString, setNotificationTimeString] = useState(
    notificationTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  )

  const titleInputRef = useRef<TextInput>(null)
  const descriptionInputRef = useRef<TextInput>(null)
  const slideAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [modalVisible])

  const isFormValid = () => {
    console.log("Validating form:", {
      title: title.trim() !== "",
      dateValid: dateString && !dateError,
      timeValid: timeString && !timeError,
    })
    return title.trim() !== "" && dateString && !dateError && timeString && !timeError
  }

  const handleAddEvent = () => {
    console.log("Form validation result:", isFormValid())
    console.log("Current form values:", {
      title,
      description,
      dateString,
      timeString,
      timeAmPm,
      notificationTimeString,
      notificationTimeAmPm,
    })

    if (!userId) {
      Alert.alert("Error", "You must be logged in to add events.")
      return
    }
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all required fields correctly.")
      return
    }

    const formattedTime = `${timeString} ${timeAmPm}`
    const formattedNotificationTime = `${notificationTimeString} ${notificationTimeAmPm}`

    const newEvent = {
      title,
      description,
      time: formattedTime,
      notificationTime: formattedNotificationTime,
      date: dateString,
      priority,
      userId: userId || "anonymous",
    }

    console.log("Attempting to add event:", newEvent)

    onAddEvent(newEvent)
      .then(() => {
        console.log("Event added successfully")
        setModalVisible(false)
        resetForm()
        Alert.alert("Success", "Event added successfully!")
      })
      .catch((error) => {
        console.error("Error adding event:", error)
        Alert.alert("Error", "Failed to add event. Please try again.")
      })
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate(new Date(selectedDate))
    setTime(new Date())
    setNotificationTime(new Date())
    setPriority("low")
    setTitleError(false)
    setDateError(false)
    setTimeError(false)
    setHasUnsavedChanges(false)
    setDateString(new Date(selectedDate).toLocaleDateString())
    setTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    setNotificationTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    setTimeAmPm("AM")
    setNotificationTimeAmPm("AM")
  }

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
      const formattedDate = selectedDate.toISOString().split("T")[0]
      console.log("Selected date formatted:", formattedDate)
      setDateString(formattedDate)
      setDateError(false)
      setHasUnsavedChanges(true)
    }
  }

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false)
    if (selectedTime) {
      setTime(selectedTime)
      setTimeString(selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setTimeError(false)
      setHasUnsavedChanges(true)
    }
  }

  const onNotificationTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowNotificationTimePicker(false)
    if (selectedTime) {
      setNotificationTime(selectedTime)
      setNotificationTimeString(selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setHasUnsavedChanges(true)
    }
  }

  const handleTitleChange = (text: string) => {
    setTitle(text)
    setTitleError(false)
    setHasUnsavedChanges(true)
  }

  const handleDescriptionChange = (text: string) => {
    setDescription(text)
    setHasUnsavedChanges(true)
  }

  const handlePriorityChange = (p: Event["priority"]) => {
    setPriority(p)
    setHasUnsavedChanges(true)
  }

  const getPriorityColor = (p: Event["priority"]) => {
    switch (p) {
      case "high":
        return "#FF6B6B"
      case "medium":
        return "#FFD93D"
      case "low":
        return "#6BCB77"
      default:
        return "#B4E3A7"
    }
  }

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      Alert.alert("Unsaved Changes", "You have unsaved changes. Are you sure you want to close?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close",
          style: "destructive",
          onPress: () => {
            setModalVisible(false)
            resetForm()
          },
        },
      ])
    } else {
      setModalVisible(false)
      resetForm()
    }
  }

  const renderDateTimePicker = (
    show: boolean,
    value: Date,
    onChange: (event: any, date?: Date) => void,
    mode: "date" | "time",
  ) => {
    if (!show) return null

    return (
      <DateTimePicker
        testID={`${mode}Picker`}
        value={value}
        mode={mode}
        is24Hour={false}
        display="default"
        onChange={onChange}
      />
    )
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getPriorityColor(priority) }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
      <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.modalTitle}>Add New Event</Text>
                <View style={styles.priorityBadge}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(priority) }]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    ref={titleInputRef}
                    style={[styles.input, titleError && styles.inputError]}
                    placeholder="Enter event title"
                    placeholderTextColor="#A0AEC0"
                    value={title}
                    onChangeText={handleTitleChange}
                    onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  />
                  {titleError && <Text style={styles.errorText}>Title is required</Text>}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    ref={descriptionInputRef}
                    style={styles.input}
                    placeholder="Enter event description"
                    placeholderTextColor="#A0AEC0"
                    value={description}
                    onChangeText={handleDescriptionChange}
                    multiline
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Priority</Text>
                  <View style={styles.priorityContainer}>
                    {(["low", "medium", "high"] as const).map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.priorityButton,
                          priority === p && styles.priorityButtonSelected,
                          { borderColor: getPriorityColor(p) },
                        ]}
                        onPress={() => handlePriorityChange(p)}
                      >
                        <Text
                          style={[
                            styles.priorityButtonText,
                            priority === p && styles.priorityButtonTextSelected,
                            { color: getPriorityColor(p) },
                          ]}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Update the date input field to handle YYYY-MM-DD format */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date *</Text>
                  <View style={styles.dateTimeContainer}>
                    <TextInput
                      style={[styles.dateTimeInput, dateError && styles.inputError]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#A0AEC0"
                      value={dateString}
                      onChangeText={(text) => {
                        setDateString(text)
                        // Simple validation for YYYY-MM-DD format
                        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(text)
                        setDateError(!isValidDate)
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <TouchableOpacity style={styles.dateTimeIcon} onPress={() => setShowDatePicker(true)}>
                      <Ionicons name="calendar-outline" size={24} color="#8AA9B8" />
                    </TouchableOpacity>
                  </View>
                  {dateError && <Text style={styles.errorText}>Invalid date format (YYYY-MM-DD)</Text>}
                  {showDatePicker && renderDateTimePicker(showDatePicker, date, onDateChange, "date")}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Event Time *</Text>
                  <View style={styles.dateTimeContainer}>
                    <TextInput
                      style={[styles.dateTimeInput, timeError && styles.inputError]}
                      placeholder="HH:MM"
                      placeholderTextColor="#A0AEC0"
                      value={timeString}
                      onFocus={() => setTimeString("")}
                      onChangeText={(text) => {
                        const formatted = text
                          .replace(/\D/g, "")
                          .replace(/^(\d{2})/, "$1:")
                          .slice(0, 5)
                        setTimeString(formatted)
                        const [hours, minutes] = formatted.split(":")
                        const newTime = new Date()
                        newTime.setHours(Number.parseInt(hours, 10))
                        newTime.setMinutes(Number.parseInt(minutes, 10))
                        if (!isNaN(newTime.getTime()) && formatted.length === 5) {
                          setTime(newTime)
                          setTimeError(false)
                        } else {
                          setTimeError(true)
                        }
                        setHasUnsavedChanges(true)
                      }}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <View style={styles.amPmContainer}>
                      <TouchableOpacity
                        style={[styles.amPmButton, timeAmPm === "AM" && styles.amPmButtonSelected]}
                        onPress={() => setTimeAmPm("AM")}
                      >
                        <Text style={[styles.amPmButtonText, timeAmPm === "AM" && styles.amPmButtonTextSelected]}>
                          AM
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.amPmButton, timeAmPm === "PM" && styles.amPmButtonSelected]}
                        onPress={() => setTimeAmPm("PM")}
                      >
                        <Text style={[styles.amPmButtonText, timeAmPm === "PM" && styles.amPmButtonTextSelected]}>
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.dateTimeIcon} onPress={() => setShowTimePicker(true)}>
                      <Ionicons name="time-outline" size={24} color="#8AA9B8" />
                    </TouchableOpacity>
                  </View>
                  {timeError && <Text style={styles.errorText}>Invalid time format</Text>}
                  {showTimePicker && renderDateTimePicker(showTimePicker, time, onTimeChange, "time")}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notification Time *</Text>
                  <View style={styles.dateTimeContainer}>
                    <TextInput
                      style={styles.dateTimeInput}
                      placeholder="HH:MM"
                      placeholderTextColor="#A0AEC0"
                      value={notificationTimeString}
                      onFocus={() => setNotificationTimeString("")}
                      onChangeText={(text) => {
                        const formatted = text
                          .replace(/\D/g, "")
                          .replace(/^(\d{2})/, "$1:")
                          .slice(0, 5)
                        setNotificationTimeString(formatted)
                        const [hours, minutes] = formatted.split(":")
                        const newTime = new Date()
                        newTime.setHours(Number.parseInt(hours, 10))
                        newTime.setMinutes(Number.parseInt(minutes, 10))
                        if (!isNaN(newTime.getTime()) && formatted.length === 5) {
                          setNotificationTime(newTime)
                        }
                        setHasUnsavedChanges(true)
                      }}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <View style={styles.amPmContainer}>
                      <TouchableOpacity
                        style={[styles.amPmButton, notificationTimeAmPm === "AM" && styles.amPmButtonSelected]}
                        onPress={() => setNotificationTimeAmPm("AM")}
                      >
                        <Text
                          style={[
                            styles.amPmButtonText,
                            notificationTimeAmPm === "AM" && styles.amPmButtonTextSelected,
                          ]}
                        >
                          AM
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.amPmButton, notificationTimeAmPm === "PM" && styles.amPmButtonSelected]}
                        onPress={() => setNotificationTimeAmPm("PM")}
                      >
                        <Text
                          style={[
                            styles.amPmButtonText,
                            notificationTimeAmPm === "PM" && styles.amPmButtonTextSelected,
                          ]}
                        >
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.dateTimeIcon} onPress={() => setShowNotificationTimePicker(true)}>
                      <Ionicons name="notifications-outline" size={24} color="#8AA9B8" />
                    </TouchableOpacity>
                  </View>
                  {showNotificationTimePicker &&
                    renderDateTimePicker(
                      showNotificationTimePicker,
                      notificationTime,
                      onNotificationTimeChange,
                      "time",
                    )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      !isFormValid() && styles.addButtonDisabled,
                      { backgroundColor: getPriorityColor(priority) },
                    ]}
                    onPress={handleAddEvent}
                    disabled={!isFormValid()}
                  >
                    <Text style={styles.addButtonText}>Add Event</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#1A1A25",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollViewContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A35",
    paddingBottom: 8,
    width: "100%",
    textAlign: "center",
  },
  priorityBadge: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#242535",
  },
  priorityText: {
    fontWeight: "bold",
    color: "#FF9500",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#242535",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    marginHorizontal: 4,
    borderColor: "#2A2A35",
    backgroundColor: "#242535",
  },
  priorityButtonSelected: {
    backgroundColor: "#242535",
    borderColor: "#FF9500",
  },
  priorityButtonText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  priorityButtonTextSelected: {
    fontWeight: "bold",
    color: "#FF9500",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242535",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  dateTimeInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  dateTimeIcon: {
    padding: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#FF9500",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#242535",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  dateTimePickerContainer: {
    backgroundColor: "#242535",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  dateTimePickerButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF9500",
    borderRadius: 8,
  },
  dateTimePickerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  amPmContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  amPmButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginHorizontal: 2,
  },
  amPmButtonSelected: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  amPmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  amPmButtonTextSelected: {
    color: "#FFFFFF",
  },
})

export default AddEventButton