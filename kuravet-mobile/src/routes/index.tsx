import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import PetRegistrationScreen from '../screens/PetRegistrationScreen';
import HealthGuideScreen from '../screens/HealthGuideScreen';

const Tab = createBottomTabNavigator();

export default function Routes() {
  const { signed } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {signed ? (
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
            tabBarActiveTintColor: theme.colors.secondary,
            tabBarInactiveTintColor: theme.colors.primary,
          }}
        >
          <Tab.Screen name="Pets" component={PetRegistrationScreen} />
          <Tab.Screen name="Guia" component={HealthGuideScreen} />
        </Tab.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}