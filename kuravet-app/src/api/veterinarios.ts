import apiClient from './client';
import type { Veterinario } from '../types';

// Camada de acesso a dados do domínio Veterinário — espelha o VeterinarioController real
// (`/api/veterinarios`, ver docs/API_CONTRACT.md, seção Veterinários). Endpoint autenticado
// (mesmo interceptor de Authorization de src/api/client.ts), somente leitura: não existe
// Create/Update/Delete de veterinário pelo app (cadastro de veterinário é responsabilidade do
// portal web, fora deste repositório).

// GET /api/veterinarios — lista todos os veterinários da clínica, sem filtro por dono (não há
// esse conceito aqui: veterinário não pertence a um tutor). Usado por
// src/screens/TeleconsultaScreen.tsx para o tutor ver quem está disponível, antes do fluxo de
// solicitar consulta em si (previsto para a Sprint 4, ver docs/AUDITORIA.md).
export async function listarVeterinarios(): Promise<Veterinario[]> {
  const { data } = await apiClient.get<Veterinario[]>('/veterinarios');
  return data;
}
