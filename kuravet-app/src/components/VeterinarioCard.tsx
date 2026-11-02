import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { Veterinario } from '../types';

interface VeterinarioCardProps {
  veterinario: Veterinario;
  selecionado?: boolean;
  onPress?: () => void;
}

export default function VeterinarioCard({
  veterinario,
  selecionado = false,
  onPress,
}: VeterinarioCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <TouchableOpacity
      style={[styles.card, selecionado && styles.cardSelecionado]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{veterinario.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome} numberOfLines={1}>
          {veterinario.nome}
        </Text>
        <Text style={styles.cardDetalhe} numberOfLines={1}>
          {veterinario.especialidade}
        </Text>
        <Text style={styles.cardCrmv}>{veterinario.crmv}</Text>
      </View>
    </TouchableOpacity>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    cardSelecionado: {
      borderColor: c.primary,
      borderWidth: 2,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '800',
      color: c.title,
    },
    cardInfo: {
      flex: 1,
    },
    cardNome: {
      fontSize: 15,
      fontWeight: '700',
      color: c.title,
    },
    cardDetalhe: {
      marginTop: 3,
      fontSize: 13,
      color: c.textSecondary,
    },
    cardCrmv: {
      marginTop: 3,
      fontSize: 12,
      color: c.textSecondary,
    },
  });
}
