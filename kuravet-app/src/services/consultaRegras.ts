import type { Consulta } from '../types';

export const TIPO_CONSULTA_MAX_LENGTH = 40;

const DATA_CONSULTA_REGEX = /^\d{4}-\d{2}-\d{2}$/;


export function podeCancelar(consulta: Consulta): boolean {
  return consulta.status === 'SOLICITADA' || consulta.status === 'AGENDADA';
}


export function consultasComDiagnostico(consultas: Consulta[]): Consulta[] {
  return consultas
    .filter((consulta) => consulta.status === 'REALIZADA' && !!consulta.diagnostico)
    .sort((a, b) => b.dataConsulta.localeCompare(a.dataConsulta));
}


export function validarTipoConsulta(tipoConsulta: string): boolean {
  const tamanho = tipoConsulta.trim().length;
  return tamanho > 0 && tamanho <= TIPO_CONSULTA_MAX_LENGTH;
}


export function validarDataConsultaFutura(dataConsulta: string): boolean {
  if (!DATA_CONSULTA_REGEX.test(dataConsulta)) {
    return false;
  }

  const hoje = new Date();
  const hojeISO = hoje.toISOString().slice(0, 10);
  return dataConsulta > hojeISO;
}
