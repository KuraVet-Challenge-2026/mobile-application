import apiClient from './client';
import type { Tutor, TutorInput } from '../types';

export async function listarTutores(): Promise<Tutor[]> {
  const { data } = await apiClient.get<Tutor[]>('/tutores');
  return data;
}

// GET /api/tutores/{id} — usar exclusivamente com o idTutor do próprio usuário autenticado.
export async function buscarTutor(idTutor: number): Promise<Tutor> {
  const { data } = await apiClient.get<Tutor>(`/tutores/${idTutor}`);
  return data;
}

// PUT /api/tutores/{id} — idem, exclusivamente o próprio idTutor.
export async function atualizarTutor(idTutor: number, payload: TutorInput): Promise<Tutor> {
  const { data } = await apiClient.put<Tutor>(`/tutores/${idTutor}`, payload);
  return data;
}

// DELETE /api/tutores/{id} — idem. 204 No Content em sucesso ("excluir minha conta").
export async function excluirTutor(idTutor: number): Promise<void> {
  await apiClient.delete(`/tutores/${idTutor}`);
}
