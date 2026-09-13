import { useQuery } from '@tanstack/react-query';

import { listarVeterinarios } from '../api/veterinarios';

export function useVeterinarios() {
  return useQuery({
    queryKey: ['veterinarios'],
    queryFn: listarVeterinarios,
  });
}
