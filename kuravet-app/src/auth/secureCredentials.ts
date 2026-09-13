import * as secureStorage from './secureStorage';
import { base64Encode } from '../utils/base64';
import type { Credenciais } from '../types';

const CREDENCIAIS_KEY = 'kuravet.credenciais';


export async function salvarCredenciais(credenciais: Credenciais): Promise<void> {
  await secureStorage.setItem(CREDENCIAIS_KEY, JSON.stringify(credenciais));
}

export async function obterCredenciais(): Promise<Credenciais | null> {
  const bruto = await secureStorage.getItem(CREDENCIAIS_KEY);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as Credenciais;
  } catch {

    await limparCredenciais();
    return null;
  }
}

export async function limparCredenciais(): Promise<void> {
  await secureStorage.removeItem(CREDENCIAIS_KEY);
}

export function montarHeaderBasicAuth({ username, senha }: Credenciais): string {
  return `Basic ${base64Encode(`${username}:${senha}`)}`;
}
