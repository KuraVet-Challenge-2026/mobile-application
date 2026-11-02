import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../theme';
import type { StatusConsulta } from '../types';
import { rotuloStatusConsulta } from '../services/consultaRegras';

interface StatusConsultaBadgeProps {
  status: StatusConsulta;
}

export default function StatusConsultaBadge({ status }: StatusConsultaBadgeProps) {
  const { colors } = useAppTheme();
  const cor = colors.statusConsulta[status];

  return (
    <View style={[styles.badge, { backgroundColor: cor.background }]}>
      <Text style={[styles.texto, { color: cor.texto }]}>{rotuloStatusConsulta(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  texto: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
