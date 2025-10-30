import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import DashboardScreen from './DashboardScreen';
import ApplyLicenseScreen from './ApplyLicenseScreen';
import FAQScreen from './FAQScreen';
import ViewLicenseScreen from './ViewLicenseScreen';
import LicenseCardScreen from './LicenseCardScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="DrivingLicense" component={ApplyLicenseScreen} />
        <Stack.Screen name="ViewLicense" component={ViewLicenseScreen} />
        <Stack.Screen name="LicenseCard" component={LicenseCardScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
