// Espelha TutorRequestDTO / TutorResponseDTO da API Java — ver docs/API_CONTRACT.md, seção
// Tutores. ATENÇÃO: TutorController não verifica dono hoje (gap bloqueante registrado em
// docs/PEDIDO_BACKEND.md) — qualquer tela que use estes tipos para ler/editar/excluir um tutor
// deve restringir a operação ao idTutor do usuário autenticado (usuario.idTutor, de
// src/types/auth.ts), nunca aceitar um id arbitrário vindo de navegação/deep link.

// Corpo de POST /api/tutores e PUT /api/tutores/{id}.
export interface TutorInput {
  nome: string;
  cpf: string;
  telefone?: string;
  /** Validado como formato de e-mail pelo backend (@Email) quando presente. */
  email?: string;
  endereco?: string;
}

// Corpo de resposta de GET/POST/PUT /api/tutores.
export interface Tutor {
  idTutor: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  dataCadastro: string;
}
