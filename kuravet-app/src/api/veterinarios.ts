import apiClient from './client';
import type { Veterinario } from '../types';

export async function listarVeterinarios(): Promise<Veterinario[]> {
  const { data } = await apiClient.get<Veterinario[]>('/veterinarios');
  return data;
}
