import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { SensorData } from '../types/SensorData';

// Define a threshold to determine what constitutes a significant change in sensor value
const threshold = 0.01; // Example: 5% change

// Props interface to define the expected data structure
interface SensorGraphProps {
  data: SensorData[]; // Array of sensor data
  selectedSensor: string | null; // The selected sensor (e.g., 'temperature', 'humidity')
}

const SensorGraph: React.FC<SensorGraphProps> = ({ data, selectedSensor }) => {
  // State to hold the timestamp of the selected data point when clicked
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);

  // If no sensor is selected, return null (no graph is displayed)
  if (!selectedSensor || data.length === 0) return null;

  // Function to filter and process the data for display in the graph
  const filterData = () => {
    const labels: string[] = []; // Array to store formatted timestamps
    const values: number[] = []; // Array to store sensor values
    let lastValue = data[0][selectedSensor as keyof SensorData] as number; // Initialize with the first value

    // Iterate over the data and extract the necessary information
    data.forEach((entry, index) => {
      const currentValue = entry[selectedSensor as keyof SensorData] as number | null; // Current sensor value
      const timestamp = new Date(entry.timestamp); // Convert timestamp to Date object

      // Format timestamp to show only hours and minutes
      const formattedTimestamp = `${timestamp.getHours()}:${timestamp.getMinutes() < 10 ? '0' : ''}${timestamp.getMinutes()}`;

      // Ensure the currentValue is a valid number before processing
      if (currentValue !== null && currentValue !== undefined) {
        // Check if the change in value is significant based on the threshold
        const isSignificantChange =
          Math.abs((currentValue - lastValue) / lastValue) > threshold || index === data.length - 1;

        // If the change is significant, or if it's the last data point, update the labels and values
        if (isSignificantChange) {
          labels.push(formattedTimestamp); // Add formatted timestamp
          values.push(parseFloat(currentValue.toFixed(2))); // Add the current value (rounded to 2 decimal places)
          lastValue = currentValue; // Update lastValue for future comparisons
        }
      }
    });

    return { labels, values }; // Return the filtered labels and values
  };

  // Get the filtered labels and values based on the selected sensor
  const { labels, values } = filterData();

  // Function to handle when a data point is clicked on the chart
  const handleDataPointClick = (data: { index: number }) => {
    const clickedIndex = data.index; // Get the index of the clicked data point
    if (clickedIndex !== undefined) {
      setSelectedTimestamp(labels[clickedIndex]); // Set the selected timestamp to the clicked data point
    }
  };
  const getLineColor = () => {
    switch (selectedSensor) {
      case 'temperature':
        return '#6fa3ef'; // Soft Blue for temperature
      case 'humidity':
        return '#fce74c'; // Gentle Yellow for humidity
      case 'heartRate':
        return '#f8c8d1'; // Soft Pink for heart rate
      default:
        return '#a8e6a1'; // Pastel Green for general sensor data
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSensor} Over Time</Text>

      {/* Line chart component displaying sensor data */}
      <LineChart
  data={{
    labels, // Labels (timestamps)
    datasets: [{ data: values }], // Values (sensor readings)
  }}
  width={Dimensions.get('window').width * 0.9} // Chart width set to 90% of screen width
  height={220} // Fixed height for the chart
  chartConfig={{
    backgroundColor: '#f4f4f9', // Light Gray background
    backgroundGradientFrom: '#ffffff', // White background
    backgroundGradientTo: '#ffffff', // White background
    decimalPlaces: 2, // Round to 2 decimal places
    color: (opacity = 1) => getLineColor(), // Dynamic color based on selected sensor
    labelColor: () => '#333333', // Dark Gray for labels
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffffff',
    },
    strokeWidth: 2, // Adjust the stroke width of the lines
    // No gridColor property. Use other properties like padding or borderWidth to style the graph
  }}
  style={styles.chart} // Styling for the chart container
  onDataPointClick={handleDataPointClick} // Event listener for when a data point is clicked
/>

      {/* If a timestamp is selected, display it below the chart */}
      {selectedTimestamp && (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>Timestamp: {selectedTimestamp}</Text>
        </View>
      )}
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#222', // Dark background color for the container
    padding: 20, // Padding around the container
    borderRadius: 10, // Rounded corners for the container
  },
  title: {
    fontSize: 18,
    color: '#fff', // White color for the title text
    marginBottom: 10, // Margin below the title
  },
  chart: {
    borderRadius: 10, // Rounded corners for the chart
  },
  timestampContainer: {
    marginTop: 10, // Margin above the timestamp container
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#333', // Dark background color for the timestamp container
    borderRadius: 8, // Rounded corners for the timestamp container
    borderWidth: 1, // Border for the timestamp container
    borderColor: '#555', // Border color
    shadowColor: '#000', // Shadow color for visual depth
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
  },
  timestampText: {
    fontSize: 16,
    color: '#fff', // White color for the timestamp text
    fontWeight: '600', // Slightly bold for emphasis
  },
});

export default SensorGraph;
