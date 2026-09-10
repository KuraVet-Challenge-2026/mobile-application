import { useQuery } from '@tanstack/react-query';

import apiClient from '../api/client';
import type { Consulta } from '../types';

// GET /api/consultas — TUTOR autenticado só recebe as próprias consultas (filtro aplicado no
// backend, ver docs/API_CONTRACT.md). Isolado aqui (fora de src/screens/**) por regra do
// projeto: zero fetch/axios dentro de componente de tela (CLAUDE.md regra 2).
async function fetchConsultas(): Promise<Consulta[]> {
  const { data } = await apiClient.get<Consulta[]>('/consultas');
  return data;
}

// Sem fallback mockado: lista vazia é um estado real (nenhuma consulta ainda), não motivo para
// exibir dados fixos (CLAUDE.md regra 1) — a tela decide como exibir isLoading/isError/vazio.
export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: fetchConsultas,
  });
}
