export type StatusConsulta = 'SOLICITADA' | 'AGENDADA' | 'REALIZADA' | 'CANCELADA' | 'RECUSADA';

export type NivelUrgencia = 'BAIXA' | 'MODERADA' | 'ALTA' | 'EMERGENCIA';

export interface CorBadge {
  background: string;
  texto: string;
}

export interface PaletaCores {
  background: string;
  card: string;
  primary: string;
  title: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  errorBackground: string;
  errorBorder: string;
  onPrimary: string;
  sombra: string;
  destaqueSuave: string;
  textTerciario: string;
  iconeSutil: string;
  textAccent: string;
  statusConsulta: Record<StatusConsulta, CorBadge>;
  urgencia: Record<NivelUrgencia, CorBadge>;
}
