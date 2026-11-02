import { useEffect, useRef } from 'react';

import { cancelarLembretes } from './cancelarLembretes';
import { prepararNotificacoes } from './prepararNotificacoes';
import { useAuth } from '../auth/AuthContext';

export default function PreparadorNotificacoes(): null {
  const { status } = useAuth();
  const statusAnterior = useRef(status);

  useEffect(() => {
    if (status === 'autenticado' && statusAnterior.current !== 'autenticado') {
      prepararNotificacoes().catch((error) => {
        console.warn('Não foi possível preparar as notificações.', error);
      });
    }

    if (status === 'nao-autenticado' && statusAnterior.current === 'autenticado') {
      cancelarLembretes().catch((error) => {
        console.warn('Não foi possível cancelar os lembretes agendados.', error);
      });
    }

    statusAnterior.current = status;
  }, [status]);

  return null;
}
