import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { DARK_COLORS } from './colors';

// Hoje o app não passa `theme` ao NavigationContainer, então o React Navigation já
// usa o DefaultTheme por baixo dos panos. Mantemos esse valor como está no modo claro
// para não alterar a aparência atual dos headers nativos (critério de aceite da tarefa).
export const NAVIGATION_LIGHT_THEME: Theme = DefaultTheme;

export const NAVIGATION_DARK_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DARK_COLORS.primary,
    background: DARK_COLORS.background,
    card: DARK_COLORS.card,
    text: DARK_COLORS.title,
    border: DARK_COLORS.border,
    notification: DARK_COLORS.error,
  },
};
