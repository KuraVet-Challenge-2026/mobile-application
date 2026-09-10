import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  /** Texto explicando, sem fingir funcionalidade, por que a tela está vazia hoje e quando deixa
   * de estar (ver uso em TeleconsultaScreen.tsx / HistoricoDiagnosticoScreen.tsx). */
  mensagem: string;
};

/**
 * Estado vazio honesto para uma funcionalidade prevista mas ainda não implementada — usado por
 * telas cuja rota já existe (alcançável pela Home, ver `src/routes/index.tsx`) mas cujo escopo
 * ficou fora da Sprint 3 (decisão de 2026-09-10 em `docs/AUDITORIA.md`, seção 1). O título da
 * tela já vem do header de navegação (`options.title`/nome da rota em
 * `src/routes/index.tsx`) — este componente só explica o motivo, nunca simula dado ou
 * funcionalidade real (CLAUDE.md regra 1).
 */
export default function EmptyState({ mensagem }: EmptyStateProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.rotulo}>Previsto para a Sprint 4</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDEBF7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#F2F7FC',
    borderRadius: 24,
    padding: 24,
  },
  rotulo: {
    alignSelf: 'center',
    backgroundColor: '#C9DEF2',
    color: '#1E4E79',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  mensagem: {
    fontSize: 14,
    color: '#4C7EA8',
    lineHeight: 21,
    textAlign: 'center',
  },
});
