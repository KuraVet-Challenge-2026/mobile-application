import type { NotificationResponse } from 'expo-notifications';

import { navigationRef } from '../routes/navigationRef';
import type { DadosNotificacaoTriagem } from '../services/notificacaoRegras';

function ehDadosNotificacaoTriagem(dados: unknown): dados is DadosNotificacaoTriagem {
  if (typeof dados !== 'object' || dados === null) {
    return false;
  }

  const registro = dados as Record<string, unknown>;
  return (
    (registro.tipo === 'triagem-urgente' || registro.tipo === 'lembrete-reavaliacao') &&
    typeof registro.idTriagem === 'number' &&
    typeof registro.idPet === 'number'
  );
}

export function tratarToqueNotificacao(resposta: NotificationResponse): void {
  const dados = resposta.notification.request.content.data;
  if (!ehDadosNotificacaoTriagem(dados)) {
    return;
  }

  if (dados.tipo === 'triagem-urgente') {
    navigationRef.navigate('TriagemDetalhe', { idTriagem: dados.idTriagem });
    return;
  }

  navigationRef.navigate('Triagem', { idPet: dados.idPet });
}
