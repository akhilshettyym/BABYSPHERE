// Tabs.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DummySensor from '../../components/DummySensor';
import SensorDashboard from '../../components/SensorDashboard';
import { SensorData } from '../../types/SensorData';

const Tab = createBottomTabNavigator();

const Tabs: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  return (
    <Tab.Navigator>
     
      <Tab.Screen name="Dashboard">
        {() => <SensorDashboard data={sensorData} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
