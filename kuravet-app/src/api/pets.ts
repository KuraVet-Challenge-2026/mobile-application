import apiClient from './client';
import type { Pet, PetInput } from '../types';

// Camada de acesso a dados do domínio Pet — espelha 1:1 o `PetController` real
// (`/api/pets`, ver docs/API_CONTRACT.md, seção Pets). Isolada de src/hooks/ (que cuida de
// cache/invalidação do TanStack Query) e de src/screens/** (que não pode ter fetch/axios direto,
// CLAUDE.md regra 2) — aqui fica só a chamada HTTP tipada, sem estado nenhum.

// GET /api/pets — TUTOR autenticado recebe só os próprios pets (`findByTutorIdTutor` no backend);
// VETERINARIO receberia todos, mas esse perfil não usa esta tela.
export async function listarPets(): Promise<Pet[]> {
  const { data } = await apiClient.get<Pet[]>('/pets');
  return data;
}

// GET /api/pets/{id} — 404 se o pet não existir OU não for do tutor autenticado (a API nunca
// revela pet de outro tutor, nem com 403 — ver docs/API_CONTRACT.md, seção "Perfis e escopo de
// dados").
export async function buscarPet(idPet: number): Promise<Pet> {
  const { data } = await apiClient.get<Pet>(`/pets/${idPet}`);
  return data;
}

// POST /api/pets — dono é sempre o TUTOR autenticado, resolvido pelo backend a partir do header
// Authorization; o corpo nunca carrega idTutor (ver tipo PetInput em src/types/pet.ts).
export async function criarPet(payload: PetInput): Promise<Pet> {
  const { data } = await apiClient.post<Pet>('/pets', payload);
  return data;
}

// PUT /api/pets/{id} — atualiza um pet próprio; o dono não muda (mesmo corpo do POST, sem
// idTutor).
export async function atualizarPet(idPet: number, payload: PetInput): Promise<Pet> {
  const { data } = await apiClient.put<Pet>(`/pets/${idPet}`, payload);
  return data;
}

// DELETE /api/pets/{id} — 204 No Content em sucesso. Bloqueado com 400 pelo backend se o pet
// tiver consultas registradas (regra de negócio, não validação client-side — a mensagem já vem
// pronta do ApiExceptionHandler para exibir via getApiErrorMessage).
export async function excluirPet(idPet: number): Promise<void> {
  await apiClient.delete(`/pets/${idPet}`);
}
