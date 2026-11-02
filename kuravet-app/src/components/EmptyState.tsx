import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type EmptyStateProps = {
  mensagem: string;
  rotulo?: string;
};

export default function EmptyState({ mensagem, rotulo }: EmptyStateProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          {rotulo ? <Text style={styles.rotulo}>{rotulo}</Text> : null}
          <Text style={styles.mensagem}>{mensagem}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 24,
    },
    rotulo: {
      alignSelf: 'center',
      backgroundColor: c.primary,
      color: c.title,
      fontSize: 12,
      fontWeight: '700',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 16,
    },
    mensagem: {
      fontSize: 14,
      color: c.textSecondary,
      lineHeight: 21,
      textAlign: 'center',
    },
  });
}
