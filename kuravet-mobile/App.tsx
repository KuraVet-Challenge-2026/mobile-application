import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/routes';
import { theme } from './src/theme/colors';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      <Routes />
    </AuthProvider>
  );
}