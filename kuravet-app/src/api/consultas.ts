import apiClient from './client';
import type { Consulta, ConsultaInput } from '../types';


export async function listarConsultas(): Promise<Consulta[]> {
  const { data } = await apiClient.get<Consulta[]>('/consultas');
  return data;
}


export async function buscarConsulta(idConsulta: number): Promise<Consulta> {
  const { data } = await apiClient.get<Consulta>(`/consultas/${idConsulta}`);
  return data;
}


export async function solicitarTeleconsulta(payload: ConsultaInput): Promise<Consulta> {
  const { data } = await apiClient.post<Consulta>('/consultas/solicitacoes', payload);
  return data;
}


export async function cancelarConsulta(idConsulta: number): Promise<Consulta> {
  const { data } = await apiClient.patch<Consulta>(`/consultas/${idConsulta}/cancelamento`);
  return data;
}
