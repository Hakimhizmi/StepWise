import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home/Home'
import Steps from './Steps/Steps'
import SavedProjects from './components/SavedProjects';

const Tab = createBottomTabNavigator();

export default function Routes() {
    return (
        <Tab.Navigator initialRouteName="home" screenOptions={{ headerShown: false }} tabBar={(props) => null} >
            <Tab.Screen name="home" component={Home} />
            <Tab.Screen name="steps" initialParams={{ id: undefined }} component={Steps} />
            <Tab.Screen name="saved" component={SavedProjects} />
        </Tab.Navigator>
    )
}
