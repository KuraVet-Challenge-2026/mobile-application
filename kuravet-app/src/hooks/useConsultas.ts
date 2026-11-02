import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buscarConsulta, cancelarConsulta, listarConsultas, solicitarTeleconsulta } from '../api/consultas';
import type { ConsultaInput } from '../types';

const CONSULTAS_QUERY_KEY = ['consultas'] as const;

export function useConsultas() {
  return useQuery({
    queryKey: CONSULTAS_QUERY_KEY,
    queryFn: listarConsultas,
  });
}


export function useConsulta(idConsulta: number | undefined) {
  return useQuery({
    queryKey: [...CONSULTAS_QUERY_KEY, idConsulta],
    queryFn: () => buscarConsulta(idConsulta as number),
    enabled: typeof idConsulta === 'number' && Number.isFinite(idConsulta),
  });
}


export function useSolicitarTeleconsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConsultaInput) => solicitarTeleconsulta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTAS_QUERY_KEY });
    },
  });
}


export function useCancelarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idConsulta: number) => cancelarConsulta(idConsulta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTAS_QUERY_KEY });
    },
  });
}
