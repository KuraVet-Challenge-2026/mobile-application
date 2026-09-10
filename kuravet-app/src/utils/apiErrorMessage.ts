import axios from 'axios';

import type { ApiErrorBody } from '../types/apiError';

// Extrai uma mensagem de erro amigável de uma falha de requisição via axios, seguindo o formato
// real do ApiExceptionHandler da API Java (ver docs/API_CONTRACT.md, seção Erros — ApiErrorBody
// em src/types/apiError.ts): a mensagem fica em "mensagem", não em "message"/"error" (formato
// genérico de outras APIs, não o desta). Compartilhado entre todas as telas/hooks que chamam a
// API (CadastroPet, AuthContext, hooks de src/hooks/) para manter o tratamento de erro
// consistente em todo o app.
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir a operação. Tente novamente em instantes.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorBody> | undefined;

    // Erro de validação de campo (@Valid falhou) — junta as mensagens de todos os campos
    // inválidos, mais útil ao usuário do que o "mensagem" genérico que acompanha esse caso
    // ("Erro de validacao nos campos informados.").
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
