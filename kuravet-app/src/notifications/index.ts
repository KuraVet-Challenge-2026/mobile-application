import type { NotificationResponse } from 'expo-notifications';

import { notificacoesDisponiveis } from './disponibilidade';
import type { TriagemResponse } from '../types';

type Implementacao = typeof import('./implementacao');

// O expo-notifications quebra o Expo Go 57 no Android já no import
// (https://github.com/expo/expo/issues/52175). Por isso a implementação só é carregada,
// com require condicional, quando o módulo nativo existe (APK, dev build, iOS).
const implementacao: Implementacao | null = notificacoesDisponiveis
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- import estático quebraria o Expo Go Android (issue acima)
    (require('./implementacao') as Implementacao)
  : null;

let avisoExibido = false;

function avisarIndisponivel(): void {
  if (avisoExibido) {
    return;
  }
  avisoExibido = true;
  console.warn(
    'Notificações desativadas: o Expo Go 57 no Android não suporta expo-notifications ' +
      '(https://github.com/expo/expo/issues/52175). Valide as notificações no APK.',
  );
}

export function configurarNotificacoes(): void {
  if (!implementacao) {
    avisarIndisponivel();
    return;
  }
  implementacao.configurarNotificacoes();
}

export async function prepararNotificacoes(): Promise<boolean> {
  if (!implementacao) {
    avisarIndisponivel();
    return false;
  }
  return implementacao.prepararNotificacoes();
}

export async function notificarResultadoTriagem(triagem: TriagemResponse): Promise<void> {
  if (!implementacao) {
    avisarIndisponivel();
    return;
  }
  await implementacao.notificarResultadoTriagem(triagem);
}

export async function cancelarLembretes(): Promise<void> {
  if (!implementacao) {
    avisarIndisponivel();
    return;
  }
  await implementacao.cancelarLembretes();
}

export function tratarToqueNotificacao(resposta: NotificationResponse): void {
  if (!implementacao) {
    avisarIndisponivel();
    return;
  }
  implementacao.tratarToqueNotificacao(resposta);
}

function ComponenteIndisponivel(): null {
  return null;
}

export const PreparadorNotificacoes: Implementacao['PreparadorNotificacoes'] =
  implementacao?.PreparadorNotificacoes ?? ComponenteIndisponivel;

export const OuvinteToqueNotificacao: Implementacao['OuvinteToqueNotificacao'] =
  implementacao?.OuvinteToqueNotificacao ?? ComponenteIndisponivel;
