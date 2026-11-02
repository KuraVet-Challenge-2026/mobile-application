import * as Notifications from 'expo-notifications';

import { CANAL_LEMBRETES, CANAL_TRIAGEM_URGENTE } from './canais';
import {
  decidirNotificacao,
  identificadorLembrete,
  type DadosNotificacaoTriagem,
} from '../services/notificacaoRegras';
import type { TriagemResponse } from '../types';

export async function notificarResultadoTriagem(triagem: TriagemResponse): Promise<void> {
  const permissoes = await Notifications.getPermissionsAsync();
  if (!permissoes.granted) {
    return;
  }

  const identificadorDoLembrete = identificadorLembrete(triagem.idPet);
  await Notifications.cancelScheduledNotificationAsync(identificadorDoLembrete);

  const decisao = decidirNotificacao(triagem);

  if (decisao.tipo === 'URGENTE') {
    const dados: DadosNotificacaoTriagem = {
      tipo: 'triagem-urgente',
      idTriagem: triagem.idTriagem,
      idPet: triagem.idPet,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: decisao.titulo,
        body: decisao.corpo,
        data: dados,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: { channelId: CANAL_TRIAGEM_URGENTE },
    });
    return;
  }

  const dados: DadosNotificacaoTriagem = {
    tipo: 'lembrete-reavaliacao',
    idTriagem: triagem.idTriagem,
    idPet: triagem.idPet,
  };

  await Notifications.scheduleNotificationAsync({
    identifier: identificadorDoLembrete,
    content: {
      title: decisao.titulo,
      body: decisao.corpo,
      data: dados,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: decisao.emSegundos,
      channelId: CANAL_LEMBRETES,
    },
  });
}
