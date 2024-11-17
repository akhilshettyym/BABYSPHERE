import React, { useState } from 'react';
import SensorDashboard from '../../components/SensorDashboard';
import { SensorData } from '../../types/SensorData';

const Tabs: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  return <SensorDashboard data={sensorData} />;
};

export default Tabs;