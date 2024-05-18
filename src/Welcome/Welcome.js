import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';

const Tab = createMaterialTopTabNavigator();

export default function Welcome() {
  
  return (
    <Tab.Navigator initialRouteName='page1' tabBar={() => null} >
      <Tab.Screen name="page1" component={Page1} />
      <Tab.Screen name="page2" component={Page2} />
      <Tab.Screen name="page3" component={Page3} options={{ swipeEnabled: false }} />
    </Tab.Navigator>
  )
}
