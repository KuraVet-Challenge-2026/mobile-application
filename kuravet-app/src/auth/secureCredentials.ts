import * as secureStorage from './secureStorage';
import { base64Encode } from '../utils/base64';
import type { Credenciais } from '../types';

// Chave única do item no armazenamento seguro do dispositivo (Keychain no iOS, Keystore no
// Android/EncryptedSharedPreferences). Nunca usar AsyncStorage aqui (regra 4 do CLAUDE.md).
//
// `secureStorage` é resolvido por plataforma pelo Metro: `secureStorage.ts` (Android/iOS, via
// expo-secure-store) ou `secureStorage.web.ts` (fallback só de desenvolvimento, sem segurança
// real — ver esse arquivo e docs/AUDITORIA.md). Este módulo não sabe nem precisa saber qual dos
// dois está rodando.
const CREDENCIAIS_KEY = 'kuravet.credenciais';

// Persiste username/senha após validados (ver AuthContext.login) — nunca salvar antes de
// confirmar contra a API que a combinação é válida.
export async function salvarCredenciais(credenciais: Credenciais): Promise<void> {
  await secureStorage.setItem(CREDENCIAIS_KEY, JSON.stringify(credenciais));
}

export async function obterCredenciais(): Promise<Credenciais | null> {
  const bruto = await secureStorage.getItem(CREDENCIAIS_KEY);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as Credenciais;
  } catch {
    // Valor corrompido ou de um formato antigo — trata como "sem sessão salva" em vez de
    // derrubar o app com uma exceção de parsing.
    await limparCredenciais();
    return null;
  }
}

export async function limparCredenciais(): Promise<void> {
  await secureStorage.removeItem(CREDENCIAIS_KEY);
}

// Monta o header HTTP Basic exigido pela API Java (única forma de autenticação dela — ver
// docs/API_CONTRACT.md). base64Encode é local (src/utils/base64.ts) para não depender de
// `btoa`/`Buffer`, que não são garantidos em todo runtime.
export function montarHeaderBasicAuth({ username, senha }: Credenciais): string {
  return `Basic ${base64Encode(`${username}:${senha}`)}`;
}
