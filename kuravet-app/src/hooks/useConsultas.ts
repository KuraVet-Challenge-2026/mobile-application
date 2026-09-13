import { useQuery } from '@tanstack/react-query';

import apiClient from '../api/client';
import type { Consulta } from '../types';


async function fetchConsultas(): Promise<Consulta[]> {
  const { data } = await apiClient.get<Consulta[]>('/consultas');
  return data;
}

export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: fetchConsultas,
  });
}
