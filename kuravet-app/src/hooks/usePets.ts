import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { atualizarPet, buscarPet, criarPet, excluirPet, listarPets } from '../api/pets';
import type { PetInput } from '../types';

const PETS_QUERY_KEY = ['pets'] as const;

export function usePets() {
  return useQuery({
    queryKey: PETS_QUERY_KEY,
    queryFn: listarPets,
  });
}

export function usePet(idPet: number | undefined) {
  return useQuery({
    queryKey: [...PETS_QUERY_KEY, idPet],
    queryFn: () => buscarPet(idPet as number),
    enabled: typeof idPet === 'number' && Number.isFinite(idPet),
  });
}


export function useCriarPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
}


export function useAtualizarPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idPet, payload }: { idPet: number; payload: PetInput }) =>
      atualizarPet(idPet, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
}

export function useExcluirPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idPet: number) => excluirPet(idPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
}
