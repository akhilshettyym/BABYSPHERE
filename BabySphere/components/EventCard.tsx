import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Event } from "../types/types"

interface EventCardProps {
  event: Event
  onUpdate: (updatedEvent: Partial<Event>) => void
  onDelete: () => void
}

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
  const handlePriorityChange = () => {
    const priorities: Array<Event["priority"]> = ["low", "medium", "high"]
    const currentIndex = priorities.indexOf(event.priority)
    const newPriority = priorities[(currentIndex + 1) % priorities.length]
    onUpdate({ priority: newPriority })
  }

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor(event.priority) }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>Event Time: {event.time}</Text>
        <Text style={styles.time}>Notification Time: {event.notificationTime}</Text>
        <Text style={styles.time}>Created: {new Date(event.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.priorityButton} onPress={handlePriorityChange}>
          <Text style={styles.priorityText}>{event.priority}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A35",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priorityButton: {
    backgroundColor: "#242535",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  priorityText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  deleteButton: {
    padding: 4,
  },
})