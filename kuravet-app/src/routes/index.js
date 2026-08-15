import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CadastroPetScreen from '../screens/CadastroPetScreen';
import HistoricoDiagnosticoScreen from '../screens/HistoricoDiagnosticoScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="CadastroPet"
        component={CadastroPetScreen}
        options={{ title: 'Cadastro de Pet' }}
      />
      <Stack.Screen
        name="HistoricoDiagnostico"
        component={HistoricoDiagnosticoScreen}
        options={{ title: 'Histórico de Diagnóstico' }}
      />
      <Stack.Screen name="Teleconsulta" component={TeleconsultaScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
