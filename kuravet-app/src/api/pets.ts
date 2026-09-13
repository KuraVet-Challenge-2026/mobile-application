import apiClient from './client';
import type { Pet, PetInput } from '../types';


export async function listarPets(): Promise<Pet[]> {
  const { data } = await apiClient.get<Pet[]>('/pets');
  return data;
}


export async function buscarPet(idPet: number): Promise<Pet> {
  const { data } = await apiClient.get<Pet>(`/pets/${idPet}`);
  return data;
}


export async function criarPet(payload: PetInput): Promise<Pet> {
  const { data } = await apiClient.post<Pet>('/pets', payload);
  return data;
}


export async function atualizarPet(idPet: number, payload: PetInput): Promise<Pet> {
  const { data } = await apiClient.put<Pet>(`/pets/${idPet}`, payload);
  return data;
}

export async function excluirPet(idPet: number): Promise<void> {
  await apiClient.delete(`/pets/${idPet}`);
}
