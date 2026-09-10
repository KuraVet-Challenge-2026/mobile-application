import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { atualizarPet, buscarPet, criarPet, excluirPet, listarPets } from '../api/pets';
import type { PetInput } from '../types';

// Chave raiz de cache do domínio Pet. `invalidateQueries({ queryKey: PETS_QUERY_KEY })` invalida
// por correspondência parcial (comportamento padrão do TanStack Query) — atinge tanto ['pets']
// (a listagem) quanto qualquer ['pets', idPet] em cache (o detalhe de um pet específico) com uma
// única chamada, então toda mutation abaixo só precisa invalidar esta chave para a Lista e o
// Detalhe relerem a API sozinhos, sem reload manual (CLAUDE.md regra 2, rubrica 1.2).
const PETS_QUERY_KEY = ['pets'] as const;

// GET /api/pets — TUTOR autenticado só recebe os próprios pets (filtro no backend, ver
// docs/API_CONTRACT.md). Isolado aqui (fora de src/screens/**) por regra do projeto: zero
// fetch/axios dentro de componente de tela.
export function usePets() {
  return useQuery({
    queryKey: PETS_QUERY_KEY,
    queryFn: listarPets,
  });
}

// GET /api/pets/{id} — usada pelas telas de Detalhe e Edição. `enabled` evita disparar a
// requisição antes do param de rota estar disponível (ex.: primeiro render da navegação).
export function usePet(idPet: number | undefined) {
  return useQuery({
    queryKey: [...PETS_QUERY_KEY, idPet],
    queryFn: () => buscarPet(idPet as number),
    enabled: typeof idPet === 'number' && Number.isFinite(idPet),
  });
}

// POST /api/pets (Create).
export function useCriarPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
}

// PUT /api/pets/{id} (Update). Recebe idPet + payload juntos porque `mutate` só aceita um
// argumento de variável — mais simples que currying a mutationFn por chamada.
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

// DELETE /api/pets/{id} (Delete). Backend bloqueia com 400 se o pet tiver consultas registradas
// — esse erro chega normalmente pelo `onError` de quem chama `mutate`, sem tratamento especial
// aqui (a mensagem do ApiExceptionHandler já é amigável, ver getApiErrorMessage).
export function useExcluirPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idPet: number) => excluirPet(idPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
}
