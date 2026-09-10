import { useQuery } from '@tanstack/react-query';

import { listarVeterinarios } from '../api/veterinarios';

// GET /api/veterinarios — isolado aqui (fora de src/screens/**) por regra do projeto: zero
// fetch/axios dentro de componente de tela (CLAUDE.md regra 2). Sem fallback mockado: lista
// vazia é um estado real, tratado pela tela (CLAUDE.md regra 1).
export function useVeterinarios() {
  return useQuery({
    queryKey: ['veterinarios'],
    queryFn: listarVeterinarios,
  });
}
