import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buscarTriagem, criarTriagem, listarTriagens } from '../api/triagens';
import type { TriagemInput, TriagemResponse } from '../types';

const TRIAGENS_QUERY_KEY = ['triagens'] as const;

export function useTriagens() {
  return useQuery({
    queryKey: TRIAGENS_QUERY_KEY,
    queryFn: listarTriagens,
  });
}


export function useTriagem(idTriagem: number | undefined) {
  return useQuery({
    queryKey: [...TRIAGENS_QUERY_KEY, idTriagem],
    queryFn: () => buscarTriagem(idTriagem as number),
    enabled: typeof idTriagem === 'number' && Number.isFinite(idTriagem),
  });
}


export function useTriagensDoPet(idPet: number | undefined) {
  return useQuery({
    queryKey: TRIAGENS_QUERY_KEY,
    queryFn: listarTriagens,
    select: (triagens: TriagemResponse[]) =>
      triagens
        .filter((triagem) => triagem.idPet === idPet)
        .sort((a, b) => b.dataTriagem.localeCompare(a.dataTriagem)),
    enabled: typeof idPet === 'number' && Number.isFinite(idPet),
  });
}


export function useCriarTriagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TriagemInput) => criarTriagem(input),
    retry: 0,
    onSuccess: (triagem) => {
      queryClient.invalidateQueries({ queryKey: TRIAGENS_QUERY_KEY });
      queryClient.setQueryData([...TRIAGENS_QUERY_KEY, triagem.idTriagem], triagem);
    },
  });
}
