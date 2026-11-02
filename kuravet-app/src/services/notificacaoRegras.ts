import { rotuloUrgencia } from './triagemRegras';
import type { TriagemResponse } from '../types';

const RECOMENDACAO_MAX_LENGTH = 150;
const LEMBRETE_REAVALIACAO_SEGUNDOS = 48 * 60 * 60;

export type DadosNotificacaoTriagem =
  | { tipo: 'triagem-urgente'; idTriagem: number; idPet: number }
  | { tipo: 'lembrete-reavaliacao'; idTriagem: number; idPet: number };

export type DecisaoNotificacao =
  | { tipo: 'URGENTE'; titulo: string; corpo: string }
  | { tipo: 'LEMBRETE'; titulo: string; corpo: string; emSegundos: number };

export function identificadorLembrete(idPet: number): string {
  return `lembrete-triagem-pet-${idPet}`;
}

export function decidirNotificacao(triagem: TriagemResponse): DecisaoNotificacao {
  if (triagem.urgencia === 'ALTA' || triagem.urgencia === 'EMERGENCIA') {
    return {
      tipo: 'URGENTE',
      titulo: `Triagem de ${triagem.nomePet}: urgência ${rotuloUrgencia(triagem.urgencia)}`,
      corpo: cortarTexto(triagem.recomendacao, RECOMENDACAO_MAX_LENGTH),
    };
  }

  return {
    tipo: 'LEMBRETE',
    titulo: `Como está o ${triagem.nomePet}?`,
    corpo: 'Refaça a triagem para acompanhar a evolução.',
    emSegundos: LEMBRETE_REAVALIACAO_SEGUNDOS,
  };
}

function cortarTexto(texto: string, tamanhoMaximo: number): string {
  if (texto.length <= tamanhoMaximo) {
    return texto;
  }
  return `${texto.slice(0, tamanhoMaximo).trimEnd()}…`;
}
