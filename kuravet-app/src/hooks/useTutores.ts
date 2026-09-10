import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { atualizarTutor, buscarTutor, excluirTutor, listarTutores } from '../api/tutores';
import type { TutorInput } from '../types';

// Chave raiz de cache do domínio Tutor. invalidateQueries({queryKey: TUTORES_QUERY_KEY}) invalida
// por correspondência parcial — atinge ['tutores'] (a listagem, hoje sem consumidor) e qualquer
// ['tutores', idTutor] em cache (o "Meu Perfil" do usuário logado) com uma única chamada.
const TUTORES_QUERY_KEY = ['tutores'] as const;

// GET /api/tutores — [ATENÇÃO] não filtra por dono hoje: devolve nome/CPF/e-mail/telefone/
// endereço de TODOS os tutores para qualquer autenticado (gap bloqueante registrado em
// docs/API_CONTRACT.md e docs/PEDIDO_BACKEND.md, item 3). Isolado aqui (fora de
// src/screens/**, CLAUDE.md regra 2) para uma futura tela de gestão de tutores (perfil
// VETERINARIO) — nenhuma tela do app hoje chama este hook.
export function useTutores() {
  return useQuery({
    queryKey: TUTORES_QUERY_KEY,
    queryFn: listarTutores,
  });
}

// GET /api/tutores/{idTutor} — "Meu Perfil" (ConfiguracoesScreen.tsx/EditarPerfilScreen.tsx).
// `idTutor` só pode vir de useAuth().usuario.idTutor (GET /api/auth/me) — nunca de navegação ou
// input do usuário, ver aviso de dono em src/api/tutores.ts. `enabled` evita a chamada antes do
// bootstrap de sessão terminar de resolver `usuario`.
export function useTutor(idTutor: number | undefined) {
  return useQuery({
    queryKey: [...TUTORES_QUERY_KEY, idTutor],
    queryFn: () => buscarTutor(idTutor as number),
    enabled: typeof idTutor === 'number' && Number.isFinite(idTutor),
  });
}

// PUT /api/tutores/{idTutor} (Update do próprio perfil).
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

// DELETE /api/tutores/{idTutor} ("excluir minha conta"). Quem chama decide o que fazer depois —
// ConfiguracoesScreen.tsx encadeia com logout() em onSuccess, já que o registro de tutor (e o
// usuário associado) deixou de existir.
export function useExcluirTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idTutor: number) => excluirTutor(idTutor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTORES_QUERY_KEY });
    },
  });
}
