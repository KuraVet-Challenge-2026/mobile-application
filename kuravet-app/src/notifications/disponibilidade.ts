import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * O Expo Go 57 no Android não traz o módulo nativo que o expo-notifications exige
 * (https://github.com/expo/expo/issues/52175). Fora dele (APK, dev build, iOS) tudo funciona.
 */
export const notificacoesDisponiveis = !(
  Platform.OS === 'android' &&
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient
);
