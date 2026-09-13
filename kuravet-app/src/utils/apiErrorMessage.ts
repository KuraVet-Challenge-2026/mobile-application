import axios from 'axios';

import type { ApiErrorBody } from '../types/apiError';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir a operação. Tente novamente em instantes.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorBody> | undefined;

    if (data?.campos) {
      const mensagensDeCampo = Object.values(data.campos).filter(
        (mensagem): mensagem is string => typeof mensagem === 'string' && mensagem.trim().length > 0
      );
      if (mensagensDeCampo.length) {
        return mensagensDeCampo.join(' ');
      }
    }

    if (typeof data?.mensagem === 'string' && data.mensagem.trim()) {
      return data.mensagem;
    }

    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'O servidor demorou muito para responder. Tente novamente.';
    }
  }
  return fallback;
}
