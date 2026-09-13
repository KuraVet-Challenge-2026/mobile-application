

export type StatusConsulta = 'SOLICITADA' | 'AGENDADA' | 'REALIZADA' | 'CANCELADA' | 'RECUSADA';

export interface ConsultaInput {
  idPet: number;
  idVeterinario: number;

  dataConsulta: string;

  tipoConsulta: string;
}


export interface DiagnosticoInput {
  /** Entre 15 e 400 caracteres. */
  diagnostico: string;
}


export interface RecusaInput {
  /** Entre 10 e 300 caracteres. */
  motivo: string;
}


export interface Consulta {
  idConsulta: number;
  idPet: number;
  nomePet: string;
  idVeterinario: number;
  nomeVeterinario: string;
  dataSolicitacao: string;
  dataConsulta: string;
  tipoConsulta: string;
  diagnostico: string | null;
  motivoRecusa: string | null;
  status: StatusConsulta;
}
