import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import PetRegistrationScreen from '../screens/PetRegistrationScreen';
import HealthGuideScreen from '../screens/HealthGuideScreen';
import AppointmentScreen from '../screens/AppointmentScreen';

const Tab = createBottomTabNavigator();

export default function Routes() {
  const { signed, logout } = useContext(AuthContext);


  if (!signed) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        id="MainTabs" 
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarInactiveTintColor: theme.colors.primary,
          tabBarStyle: { backgroundColor: theme.colors.white, height: 60, paddingBottom: 8 },
          headerRight: () => (
            <TouchableOpacity 
              onPress={logout} 
              style={{ 
                marginRight: 15, 
                backgroundColor: theme.colors.secondary, 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 6 
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Sair</Text>
            </TouchableOpacity>
          )
        }}
      >
        <Tab.Screen name="Meus Pets" component={PetRegistrationScreen} />
        <Tab.Screen name="Agendar" component={AppointmentScreen} />
        <Tab.Screen name="Guia de Saúde" component={HealthGuideScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}