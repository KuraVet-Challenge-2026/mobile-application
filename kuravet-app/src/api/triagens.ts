import apiClient from './client';
import type { TriagemInput, TriagemResponse } from '../types';

const TIMEOUT_CRIAR_TRIAGEM_MS = 30000;


export async function criarTriagem(input: TriagemInput): Promise<TriagemResponse> {
  const { data } = await apiClient.post<TriagemResponse>('/triagens', input, {
    timeout: TIMEOUT_CRIAR_TRIAGEM_MS,
  });
  return data;
}


export async function listarTriagens(): Promise<TriagemResponse[]> {
  const { data } = await apiClient.get<TriagemResponse[]>('/triagens');
  return data;
}


export async function buscarTriagem(idTriagem: number): Promise<TriagemResponse> {
  const { data } = await apiClient.get<TriagemResponse>(`/triagens/${idTriagem}`);
  return data;
}
