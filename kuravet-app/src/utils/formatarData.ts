export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(dataHora: string): string {
  const [dataParte, horaParte] = dataHora.split('T');
  const [ano, mes, dia] = dataParte.split('-');
  const [hora, minuto] = (horaParte ?? '00:00').split(':');
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}
