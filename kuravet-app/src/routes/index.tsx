import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Home from '../screens/Home';
import CadastroPet from '../screens/CadastroPet';
import HistoricoDiagnosticoScreen from '../screens/HistoricoDiagnosticoScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen'; // <-- 1. Importado aqui

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  CadastroPet: undefined;
  HistoricoDiagnostico: undefined;
  Teleconsulta: undefined;
  Perfil: undefined;
  Configuracoes: undefined; // <-- 2. Adicionado na tipagem
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="CadastroPet"
        component={CadastroPet}
        options={{ title: 'Cadastro de Pet' }}
      />
      <Stack.Screen
        name="HistoricoDiagnostico"
        component={HistoricoDiagnosticoScreen}
        options={{ title: 'Histórico de Diagnóstico' }}
      />
      <Stack.Screen name="Teleconsulta" component={TeleconsultaScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
        options={{ title: 'Configurações' }} // <-- 3. Registrado na Stack
      />
    </Stack.Navigator>
  );
}