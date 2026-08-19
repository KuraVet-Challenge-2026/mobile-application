import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import Home from '../screens/Home';
import CadastroPetScreen from '../screens/CadastroPetScreen';
import HistoricoDiagnosticoScreen from '../screens/HistoricoDiagnosticoScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import PerfilScreen from '../screens/PerfilScreen';

// Lista central de rotas da stack, usada para tipar `useNavigation`/`useRoute`
// em qualquer tela (ver src/screens/Home.tsx). Telas sem parâmetros usam
// `undefined`; quando alguma rota passar a receber params, tipe aqui.
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CadastroPet: undefined;
  HistoricoDiagnostico: undefined;
  Teleconsulta: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
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
