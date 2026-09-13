

export type Sexo = 'M' | 'F';

export interface PetInput {
  nome: string;
  especie: string;
  raca?: string;

  dataNascimento: string;
  sexo: Sexo;
}


export interface Pet {
  idPet: number;
  nome: string;
  especie: string;
  raca: string | null;
  dataNascimento: string;
  sexo: Sexo;
  idTutor: number;
  nomeTutor: string;
}
