import { useColorScheme } from 'react-native';

import { DARK_COLORS, LIGHT_COLORS } from './colors';
import type { PaletaCores } from './types';

export interface AppTheme {
  colors: PaletaCores;
  isDark: boolean;
}

export function useAppTheme(): AppTheme {
  const esquema = useColorScheme();
  const isDark = esquema === 'dark';

  return {
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    isDark,
  };
}
