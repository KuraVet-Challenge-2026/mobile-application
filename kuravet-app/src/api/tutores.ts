import apiClient from './client';
import type { Tutor, TutorInput } from '../types';

// Camada de acesso a dados do domínio Tutor — espelha o TutorController real (`/api/tutores`,
// ver docs/API_CONTRACT.md, seção Tutores).
//
// [ATENÇÃO] TutorController não verifica dono em nenhum método hoje (gap bloqueante, ver
// docs/PEDIDO_BACKEND.md item 3): qualquer chamada de buscarTutor/atualizarTutor/excluirTutor
// com um id que não seja o do próprio usuário autenticado seria capaz de ler/alterar/excluir o
// cadastro de OUTRO tutor — o backend não impede. Mitigação client-side: nenhuma função aqui
// deve ser chamada com um id vindo de navegação/input do usuário — só com
// `useAuth().usuario.idTutor` (de GET /api/auth/me). Ver src/hooks/useTutores.ts e
// src/screens/ConfiguracoesScreen.tsx/EditarPerfilScreen.tsx, os únicos consumidores.

// GET /api/tutores — lista TODOS os tutores, sem filtro de dono (mesmo aviso acima, ainda mais
// sensível aqui: devolve nome/CPF/e-mail/telefone/endereço de todo mundo). Mantido só para uma
// futura tela de gestão de tutores no perfil VETERINARIO — nenhuma tela do app hoje usa.
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
