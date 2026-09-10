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

// Mantido como um único tipo (em vez de um por stack) para que nenhuma tela precise mudar seu
// `NativeStackNavigationProp<RootStackParamList, 'X'>` quando as rotas são divididas entre
// AuthStack e AppStack abaixo — cada `Stack.Navigator` só registra o subconjunto que usa.
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  CadastroPet: undefined;
  // CRUD de Pet (Read/Update) — Create é CadastroPet acima, sem mudança de rota para não
  // quebrar quem já navega para lá (ex.: Home.tsx > "+ Novo Pet" dentro de PetsListScreen).
  PetsList: undefined;
  PetDetalhe: { idPet: number };
  EditarPet: { idPet: number };
  HistoricoDiagnostico: undefined;
  Teleconsulta: undefined;
  Perfil: undefined;
  Configuracoes: undefined;
  // Update do "Meu Perfil" (Tutor) — sem param: o id sempre vem de useAuth().usuario.idTutor,
  // nunca de navegação (ver src/api/tutores.ts sobre a falta de verificação de dono no backend).
  EditarPerfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Rotas acessíveis sem sessão. Login/Cadastro autenticam via `useAuth().login()`/`useAuth().cadastro()`
 * (API Java, HTTP Basic) — ver src/auth/AuthContext.tsx. */
function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

/** Rotas protegidas — só alcançáveis quando `status === 'autenticado'` (ver RootNavigator). */
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

/**
 * Guard de autenticação: decide qual stack montar com base no estado real de sessão
 * (`AuthContext`, com lastro na API Java via `expo-secure-store`) — nunca renderização
 * condicional dentro de uma tela como substituto de navegação (regra 3 do CLAUDE.md). Enquanto a
 * sessão ainda está sendo reidratada do device (`status === 'carregando'`), mostra um loading em
 * vez de decidir errado e piscar para a tela de login.
 */
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
