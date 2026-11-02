import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import type { NotificationResponse } from 'expo-notifications';

import { tratarToqueNotificacao } from './tratarToqueNotificacao';
import { navigationRef } from '../routes/navigationRef';
import { useAuth } from '../auth/AuthContext';

const INTERVALO_NOVA_TENTATIVA_MS = 100;

export default function OuvinteToqueNotificacao(): null {
  const { status } = useAuth();
  const resposta = Notifications.useLastNotificationResponse();
  const identificadoresTratados = useRef(new Set<string>());

  useEffect(() => {
    if (!resposta || status !== 'autenticado') {
      return;
    }

    const identificador = resposta.notification.request.identifier;
    if (identificadoresTratados.current.has(identificador)) {
      return;
    }

    let cancelado = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tentarNavegar(respostaRecebida: NotificationResponse) {
      if (cancelado) {
        return;
      }
      if (!navigationRef.isReady()) {
        timeoutId = setTimeout(() => tentarNavegar(respostaRecebida), INTERVALO_NOVA_TENTATIVA_MS);
        return;
      }
      identificadoresTratados.current.add(identificador);
      tratarToqueNotificacao(respostaRecebida);
    }

    tentarNavegar(resposta);

    return () => {
      cancelado = true;
      clearTimeout(timeoutId);
    };
  }, [resposta, status]);

  return null;
}
