import type { MetodoExtracao, OrigemOrientacao, TriagemResponse, Urgencia } from '../types';

export const RELATO_MIN_LENGTH = 10;
export const RELATO_MAX_LENGTH = 1000;

export const AVISO_TRIAGEM =
  'Esta triagem é orientativa e não substitui a avaliação do veterinário.';


export function rotuloUrgencia(urgencia: Urgencia): string {
  switch (urgencia) {
    case 'BAIXA':
      return 'Baixa';
    case 'MODERADA':
      return 'Moderada';
    case 'ALTA':
      return 'Alta';
    case 'EMERGENCIA':
      return 'Emergência';
  }
}


export function ehUrgente(triagem: TriagemResponse): boolean {
  return triagem.sugereTeleconsultaPrioritaria;
}


export interface DescricaoAnalise {
  selo: 'Análise por IA' | 'Modo contingência';
  contingencia: boolean;
}

export function descreverAnalise(
  triagem: Pick<TriagemResponse, 'metodoExtracao' | 'origemOrientacao'>
): DescricaoAnalise {
  const contingencia = ehContingencia(triagem.metodoExtracao, triagem.origemOrientacao);
  return {
    selo: contingencia ? 'Modo contingência' : 'Análise por IA',
    contingencia,
  };
}

function ehContingencia(
  metodoExtracao: MetodoExtracao,
  origemOrientacao: OrigemOrientacao
): boolean {
  return metodoExtracao === 'PALAVRAS_CHAVE' || origemOrientacao === 'MODELO_FIXO';
}


export function precisaExibirAviso(orientacao: string | null): boolean {
  if (!orientacao) {
    return true;
  }
  return !orientacao.includes(AVISO_TRIAGEM);
}
