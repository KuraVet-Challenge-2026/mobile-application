import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/routes';
import { AuthProvider } from './src/auth/AuthContext';

/**
 * "O pulo do gato": política de cache do TanStack Query.
 *
 * - staleTime: por quanto tempo os dados são considerados "frescos" (não refaz a
 *   requisição automaticamente nesse período).
 * - gcTime: por quanto tempo uma query inativa fica em cache antes de ser descartada.
 * - retry: quantas vezes tenta novamente antes de reportar erro (útil pois o backend
 *   Java pode demorar/oscilar).
 * - refetchOnWindowFocus: desligado, pois em mobile não faz sentido como em web.
 *
 * O timeout que realmente "segura" a interface fica no axios (src/api/client.ts).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {/* AuthProvider por fora do NavigationContainer: RootNavigator (src/routes) lê
            useAuth().status para decidir entre AuthStack e AppStack — ver guard ali. */}
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
