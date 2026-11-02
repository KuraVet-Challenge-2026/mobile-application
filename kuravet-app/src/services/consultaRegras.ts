import type { Consulta, StatusConsulta } from '../types';

export const TIPO_CONSULTA_MAX_LENGTH = 40;

const DATA_CONSULTA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const STATUS_CONSULTA_LABELS: Record<StatusConsulta, string> = {
  SOLICITADA: 'Solicitada',
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
  RECUSADA: 'Recusada',
};


export function podeCancelar(consulta: Consulta): boolean {
  return consulta.status === 'SOLICITADA' || consulta.status === 'AGENDADA';
}


export function rotuloStatusConsulta(status: StatusConsulta): string {
  return STATUS_CONSULTA_LABELS[status];
}


export function proximasDatasConsulta(qtd: number): string[] {
  const hoje = new Date();
  const datas: string[] = [];

  for (let i = 1; i <= qtd; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    datas.push(`${ano}-${mes}-${dia}`);
  }

  return datas;
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
