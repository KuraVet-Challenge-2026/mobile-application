import type { PaletaCores } from './types';

export const LIGHT_COLORS: PaletaCores = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  title: '#1E4E79',
  text: '#333333',
  textSecondary: '#4C7EA8',
  textMuted: '#666666',
  border: '#C9DEF2',
  error: '#B3261E',
  errorBackground: '#F9DEDC',
  errorBorder: '#F3C6C3',
  statusConsulta: {
    SOLICITADA: { background: '#DDEBF7', texto: '#2D6FA3' },
    AGENDADA: { background: '#C9DEF2', texto: '#1E4E79' },
    REALIZADA: { background: '#9FC6EA', texto: '#12385C' },
    CANCELADA: { background: '#F9DEDC', texto: '#B3261E' },
    RECUSADA: { background: '#F9DEDC', texto: '#B3261E' },
  },
  urgencia: {
    BAIXA: { background: '#DCF2E3', texto: '#1B7A43' },
    MODERADA: { background: '#FBF0C9', texto: '#8A6D1D' },
    ALTA: { background: '#FBE1C7', texto: '#9C5518' },
    EMERGENCIA: { background: '#F9DEDC', texto: '#B3261E' },
  },
};

export const DARK_COLORS: PaletaCores = {
  background: '#0F1B2B',
  card: '#182840',
  primary: '#3E6690',
  title: '#BFD9EF',
  text: '#E8EDF2',
  textSecondary: '#8FB4D1',
  textMuted: '#9AA5B1',
  border: '#2E4A66',
  error: '#FF8A80',
  errorBackground: '#3B1613',
  errorBorder: '#5C2B27',
  statusConsulta: {
    SOLICITADA: { background: '#1C3350', texto: '#8FC2EC' },
    AGENDADA: { background: '#1F3B57', texto: '#AFD4F2' },
    REALIZADA: { background: '#234867', texto: '#CFE6F7' },
    CANCELADA: { background: '#442726', texto: '#FF8A80' },
    RECUSADA: { background: '#442726', texto: '#FF8A80' },
  },
  urgencia: {
    BAIXA: { background: '#173825', texto: '#6FD69B' },
    MODERADA: { background: '#3A2F10', texto: '#E8C766' },
    ALTA: { background: '#3A2412', texto: '#F0A569' },
    EMERGENCIA: { background: '#442726', texto: '#FF8A80' },
  },
};
