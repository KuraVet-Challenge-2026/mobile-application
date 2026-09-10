// Espelha PetRequestDTO / PetResponseDTO da API Java — ver docs/API_CONTRACT.md, seção Pets.

export type Sexo = 'M' | 'F';

// Corpo de POST /api/pets e PUT /api/pets/{id}. Nunca carrega idTutor: o dono é sempre o TUTOR
// autenticado, resolvido pelo backend a partir do header Authorization — nunca um valor vindo
// do cliente.
export interface PetInput {
  nome: string;
  especie: string;
  raca?: string;
  /** Formato AAAA-MM-DD, precisa estar no passado (validação @Past no backend). */
  dataNascimento: string;
  sexo: Sexo;
}

// Corpo de resposta de GET/POST/PUT /api/pets — inclui idTutor/nomeTutor já achatados
// (a API não expõe a entidade Tutor completa aqui).
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
