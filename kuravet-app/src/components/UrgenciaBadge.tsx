import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../theme';
import type { Urgencia } from '../types';
import { rotuloUrgencia } from '../services/triagemRegras';

interface UrgenciaBadgeProps {
  urgencia: Urgencia;
}

export default function UrgenciaBadge({ urgencia }: UrgenciaBadgeProps) {
  const { colors } = useAppTheme();
  const cor = colors.urgencia[urgencia];

  return (
    <View style={[styles.badge, { backgroundColor: cor.background }]}>
      <Text style={[styles.texto, { color: cor.texto }]}>{rotuloUrgencia(urgencia)}</Text>
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
