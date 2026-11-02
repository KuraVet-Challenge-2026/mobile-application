import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { TriagemResponse } from '../types';
import { formatarDataHora } from '../utils/formatarData';
import UrgenciaBadge from './UrgenciaBadge';

interface TriagemHistoricoItemProps {
  triagem: TriagemResponse;
  onPress: () => void;
}

export default function TriagemHistoricoItem({ triagem, onPress }: TriagemHistoricoItemProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.linha}>
        <Text style={styles.pet}>{triagem.nomePet}</Text>
        <Text style={styles.data}>{formatarDataHora(triagem.dataTriagem)}</Text>
      </View>
      <View style={styles.badge}>
        <UrgenciaBadge urgencia={triagem.urgencia} />
      </View>
      <Text style={styles.recomendacao} numberOfLines={2}>
        {triagem.recomendacao}
      </Text>
    </TouchableOpacity>
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
    badge: { marginVertical: 8 },
    recomendacao: { fontSize: 14, color: c.text, lineHeight: 20 },
  });
}
