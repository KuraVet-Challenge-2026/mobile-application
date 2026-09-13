import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { atualizarTutor, buscarTutor, excluirTutor, listarTutores } from '../api/tutores';
import type { TutorInput } from '../types';

const TUTORES_QUERY_KEY = ['tutores'] as const;

export function useTutores() {
  return useQuery({
    queryKey: TUTORES_QUERY_KEY,
    queryFn: listarTutores,
  });
}

export function useTutor(idTutor: number | undefined) {
  return useQuery({
    queryKey: [...TUTORES_QUERY_KEY, idTutor],
    queryFn: () => buscarTutor(idTutor as number),
    enabled: typeof idTutor === 'number' && Number.isFinite(idTutor),
  });
}

export function useAtualizarTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idTutor, payload }: { idTutor: number; payload: TutorInput }) =>
      atualizarTutor(idTutor, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTORES_QUERY_KEY });
    },
  });
}

export function useExcluirTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idTutor: number) => excluirTutor(idTutor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTORES_QUERY_KEY });
    },
  });
}
