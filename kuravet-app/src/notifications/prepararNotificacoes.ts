import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { CANAL_LEMBRETES, CANAL_TRIAGEM_URGENTE } from './canais';

async function criarCanaisAndroid(): Promise<void> {
  await Notifications.setNotificationChannelAsync(CANAL_TRIAGEM_URGENTE, {
    name: 'Triagens urgentes',
    importance: Notifications.AndroidImportance.MAX,
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
  });

  await Notifications.setNotificationChannelAsync(CANAL_LEMBRETES, {
    name: 'Lembretes de reavaliação',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function prepararNotificacoes(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await criarCanaisAndroid();
  }

  const permissoesAtuais = await Notifications.getPermissionsAsync();
  if (permissoesAtuais.granted) {
    return true;
  }

  const permissoesSolicitadas = await Notifications.requestPermissionsAsync();
  return permissoesSolicitadas.granted;
}
