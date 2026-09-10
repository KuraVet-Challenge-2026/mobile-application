// Tipos de autenticação — espelham POST /api/auth/cadastro e GET /api/auth/me, confirmados como
// implementados no backend em 2026-09-03 (ver docs/API_CONTRACT.md, seção Autenticação, e
// docs/AUDITORIA.md). Consumidos por src/auth/AuthContext.tsx.

export type Perfil = 'TUTOR' | 'VETERINARIO';

// Credenciais coletadas na tela de login — nunca persistidas fora do expo-secure-store
// (ver src/auth/secureCredentials.ts) e nunca logadas/impressas.
export interface Credenciais {
  username: string;
  senha: string;
}

// Corpo esperado de POST /api/auth/cadastro (proposto).
export interface CadastroInput {
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  username: string;
  senha: string;
}

// Resposta esperada de POST /api/auth/cadastro (proposto). Nunca deve incluir a senha.
export interface CadastroResponse {
  idTutor: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  dataCadastro: string;
  username: string;
  perfil: Perfil;
}

// Resposta esperada de GET /api/auth/me (proposto) — perfil de quem está autenticado.
// idTutor/nomeTutor nulos quando perfil é VETERINARIO.
export interface UsuarioAutenticado {
  idUsuario: number;
  username: string;
  perfil: Perfil;
  idTutor: number | null;
  nomeTutor: string | null;
}
