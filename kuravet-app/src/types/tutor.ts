
export interface TutorInput {
  nome: string;
  cpf: string;
  telefone?: string;

  email?: string;
  endereco?: string;
}


export interface Tutor {
  idTutor: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  dataCadastro: string;
}
