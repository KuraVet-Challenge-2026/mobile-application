// Espelha os DTOs de Consulta/Teleconsulta da API Java — ver docs/API_CONTRACT.md, seção
// Consultas. Lembrete: Create (POST /api/consultas/solicitacoes) exige idVeterinario válido e
// não há hoje GET /api/veterinarios para escolher um dinamicamente — ver docs/AUDITORIA.md antes
// de construir qualquer tela em cima destes tipos.

export type StatusConsulta = 'SOLICITADA' | 'AGENDADA' | 'REALIZADA' | 'CANCELADA' | 'RECUSADA';

// Corpo de POST /api/consultas/solicitacoes e PUT /api/consultas/{id}. Nunca carrega status,
// diagnostico ou motivoRecusa — essas transições são exclusivas dos endpoints PATCH abaixo.
export interface ConsultaInput {
  idPet: number;
  idVeterinario: number;
  /** Formato AAAA-MM-DD, precisa ser data futura (validação @Future no backend). */
  dataConsulta: string;
  /** Máximo 40 caracteres. */
  tipoConsulta: string;
}

// Corpo de PATCH /api/consultas/{id}/diagnostico (perfil VETERINARIO).
export interface DiagnosticoInput {
  /** Entre 15 e 400 caracteres. */
  diagnostico: string;
}

// Corpo de PATCH /api/consultas/{id}/recusa (perfil VETERINARIO).
export interface RecusaInput {
  /** Entre 10 e 300 caracteres. */
  motivo: string;
}

// Corpo de resposta de GET/POST/PUT /api/consultas — idPet/nomePet e idVeterinario/
// nomeVeterinario já achatados.
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
