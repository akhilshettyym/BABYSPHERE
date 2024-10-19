import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DummySensor from './DummySensor';
import SensorGraph from './SensorGraph';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sensor Data" component={DummySensor} />
      <Tab.Screen name="Graph" component={SensorGraph} />
    </Tab.Navigator>
  );
};

export default Tabs;
