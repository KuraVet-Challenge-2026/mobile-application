

export type Perfil = 'TUTOR' | 'VETERINARIO';

export interface Credenciais {
  username: string;
  senha: string;
}

export interface CadastroInput {
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  username: string;
  senha: string;
}

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

export interface UsuarioAutenticado {
  idUsuario: number;
  username: string;
  perfil: Perfil;
  idTutor: number | null;
  nomeTutor: string | null;
}
