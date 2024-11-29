import React, { useState } from 'react';
import SensorDashboard from '../../components/SensorDashboard'; // Import SensorDashboard

const Tabs = () => {
  const [sensorData, setSensorData] = useState([]); // Manage `sensorData` here

  return (
    <SensorDashboard data={sensorData} /> // Pass data to SensorDashboard
  ); // Ensure proper closing of JSX and function block
};

export default Tabs;
