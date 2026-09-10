import axios from 'axios';
import Constants from 'expo-constants';

import { montarHeaderBasicAuth, obterCredenciais } from '../auth/secureCredentials';

// Base URL configurável via app.config.ts > extra.apiBaseUrl (que por sua vez lê a variável de
// ambiente KURAVET_API_BASE_URL, definida em .env.local — gitignorado, ver docs/RODANDO_LOCAL.md),
// sem precisar editar código nem rebuildar o app para trocar de ambiente. O valor certo depende de
// onde o app está rodando — 'localhost' só resolve para "o próprio dispositivo", nunca para o
// computador de desenvolvimento visto de um emulador/device físico. Ver README.md, seção "Base
// URL por ambiente", para a tabela completa (Expo Web, emulador Android, device físico via Expo
// Go) e como descobrir o IP de rede local. Fica na raiz "/api": as chamadas (ex.: '/pets',
// '/consultas') completam o resto do caminho — não apontar para um endpoint específico como
// '/pets', ou as demais rotas resolvem errado. Fallback (só entra em uso se KURAVET_API_BASE_URL
// não estiver definida) é 'localhost', o caso mais comum de dev — Expo Web na mesma máquina do
// backend.
const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  // 20s: tempo suficiente para o processamento mais lento da API Java, mas curto o bastante
  // para não deixar o botão girando "indefinidamente" quando o host/porta configurados em
  // app.json não respondem (ex.: IP errado, backend fora do ar) — nesses casos o axios rejeita
  // com error.code === 'ECONNABORTED', tratado por getApiErrorMessage
  // (src/utils/apiErrorMessage.ts). Reduzido de 60s (2026-09-08): 60s é tempo longo demais para
  // o usuário ficar sem feedback nenhum.
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assina toda requisição com HTTP Basic (única forma de autenticação da API — ver
// docs/API_CONTRACT.md) usando as credenciais persistidas no expo-secure-store. Sem sessão
// salva, a requisição sai sem o header — a própria API decide se a rota é pública (/ping) ou
// responde 401. Não sobrescreve um Authorization já definido explicitamente na chamada (ex.: a
// validação de login em AuthContext, que testa uma credencial ainda não persistida).
apiClient.interceptors.request.use(async (config) => {
  if (config.headers.has('Authorization')) {
    return config;
  }

  const credenciais = await obterCredenciais();
  if (credenciais) {
    config.headers.set('Authorization', montarHeaderBasicAuth(credenciais));
  }

  return config;
});

export default apiClient;
