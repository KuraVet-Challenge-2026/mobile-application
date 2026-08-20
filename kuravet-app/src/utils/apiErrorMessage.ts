import axios from 'axios';

// Extrai uma mensagem de erro amigável de uma falha de requisição via axios,
// priorizando a mensagem que o próprio backend Java devolveu no corpo da
// resposta. Compartilhado entre as telas de CRUD (CadastroPet e as que vierem
// a seguir) para manter o tratamento de erro consistente em todo o app —
// mesmo espírito de src/utils/firebaseErrorMessage.ts, mas para chamadas Axios.
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir a operação. Tente novamente em instantes.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; erro?: unknown; error?: unknown }
      | undefined;
    const backendMessage = data?.message ?? data?.erro ?? data?.error;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
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
