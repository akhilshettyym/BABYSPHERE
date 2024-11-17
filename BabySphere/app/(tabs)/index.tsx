import React, { useState } from 'react';
import SensorDashboard from '../../components/SensorDashboard'; // Import SensorDashboard
import { SensorData } from '../../types/SensorData'; // Import SensorData type

const Tabs: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]); // Manage `sensorData` here

  return (
    <SensorDashboard data={sensorData} /> /* Pass data to SensorDashboard */
    );
};

export default Tabs;
