import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Home from '../screens/Home';
import CadastroPet from '../screens/CadastroPet';
import PetsListScreen from '../screens/PetsListScreen';
import PetDetalheScreen from '../screens/PetDetalheScreen';
import EditarPetScreen from '../screens/EditarPetScreen';
import HistoricoDiagnosticoScreen from '../screens/HistoricoDiagnosticoScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import { useAuth } from '../auth/AuthContext';


export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  CadastroPet: undefined;
  
  PetsList: undefined;
  PetDetalhe: { idPet: number };
  EditarPet: { idPet: number };
  HistoricoDiagnostico: undefined;
  Teleconsulta: undefined;
  Perfil: undefined;
  Configuracoes: undefined;

  EditarPerfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="CadastroPet"
        component={CadastroPet}
        options={{ title: 'Cadastro de Pet' }}
      />
      <Stack.Screen name="PetsList" component={PetsListScreen} options={{ title: 'Meus Pets' }} />
      <Stack.Screen
        name="PetDetalhe"
        component={PetDetalheScreen}
        options={{ title: 'Detalhes do Pet' }}
      />
      <Stack.Screen
        name="EditarPet"
        component={EditarPetScreen}
        options={{ title: 'Editar Pet' }}
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
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen
        name="EditarPerfil"
        component={EditarPerfilScreen}
        options={{ title: 'Editar Perfil' }}
      />
    </Stack.Navigator>
  );
}

function TelaCarregando() {
  return (
    <View style={styles.carregando}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootNavigator() {
  const { status } = useAuth();

  if (status === 'carregando') {
    return <TelaCarregando />;
  }

  return status === 'autenticado' ? <AppStackNavigator /> : <AuthStackNavigator />;
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
