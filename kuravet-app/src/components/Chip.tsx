import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';

interface ChipProps {
  texto: string;
  selecionado: boolean;
  onPress: () => void;
}

export default function Chip({ texto, selecionado, onPress }: ChipProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <TouchableOpacity
      style={[styles.chip, selecionado && styles.chipSelecionado]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.chipTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.primary,
      backgroundColor: c.card,
      marginRight: 10,
      marginBottom: 10,
    },
    chipSelecionado: {
      backgroundColor: c.primary,
    },
    chipTexto: {
      fontSize: 14,
      fontWeight: '700',
      color: c.text,
    },
  });
}
