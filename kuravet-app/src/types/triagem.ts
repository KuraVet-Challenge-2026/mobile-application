
export type Urgencia = 'BAIXA' | 'MODERADA' | 'ALTA' | 'EMERGENCIA';

export type MetodoExtracao = 'LLM' | 'PALAVRAS_CHAVE';

export type OrigemOrientacao = 'IA_GENERATIVA' | 'MODELO_FIXO' | null;

export interface TriagemInput {
  idPet: number;
  relato: string;
}

export interface TriagemResponse {
  idTriagem: number;
  idPet: number;
  nomePet: string;
  urgencia: Urgencia;
  recomendacao: string;
  sintomas: string[];
  regrasAplicadas: string[];
  metodoExtracao: MetodoExtracao;
  dataTriagem: string;
  sugereTeleconsultaPrioritaria: boolean;
  orientacao: string | null;
  origemOrientacao: OrigemOrientacao;
}
