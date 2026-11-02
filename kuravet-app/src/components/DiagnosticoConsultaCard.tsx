import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { Consulta } from '../types';
import { formatarData } from '../utils/formatarData';

interface DiagnosticoConsultaCardProps {
  consulta: Consulta;
}

export default function DiagnosticoConsultaCard({ consulta }: DiagnosticoConsultaCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.linha}>
        <Text style={styles.pet}>{consulta.nomePet}</Text>
        <Text style={styles.data}>{formatarData(consulta.dataConsulta)}</Text>
      </View>
      <Text style={styles.veterinario}>{consulta.nomeVeterinario}</Text>
      <Text style={styles.diagnostico}>{consulta.diagnostico}</Text>
    </View>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pet: { fontSize: 16, fontWeight: '800', color: c.title, flexShrink: 1 },
    data: { fontSize: 13, color: c.textSecondary },
    veterinario: { fontSize: 13, color: c.textSecondary, marginTop: 2, marginBottom: 8 },
    diagnostico: { fontSize: 14, color: c.text, lineHeight: 20 },
  });
}
