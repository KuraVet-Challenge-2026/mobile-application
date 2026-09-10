import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import type { Veterinario } from '../types';
import { useVeterinarios } from '../hooks/useVeterinarios';
import { getApiErrorMessage } from '../utils/apiErrorMessage';

const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  title: '#1E4E79',
  subtitle: '#4C7EA8',
  error: '#B3261E',
};

/**
 * Read-only: lista os veterinários da clínica (GET /api/veterinarios, ver
 * src/hooks/useVeterinarios.ts). Sem detalhe, sem ação, sem formulário, sem mutation — o fluxo
 * de solicitar uma teleconsulta (Create) continua fora da Sprint 3, ver aviso no topo da tela e
 * docs/AUDITORIA.md.
 */
function VeterinarioCard({ veterinario }: { veterinario: Veterinario }) {
  return (
    <View style={styles.card}>
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
    </View>
  );
}

export default function TeleconsultaScreen() {
  const { data: veterinarios, isLoading, isError, error } = useVeterinarios();

  const listaVazia = !isLoading && !isError && (!veterinarios || veterinarios.length === 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.avisoBox}>
        <Text style={styles.avisoTexto}>
          Esta tela mostra os veterinários da clínica. O agendamento de teleconsulta pelo app
          chega na Sprint 4.
        </Text>
      </View>

      <FlatList
        data={veterinarios ?? []}
        keyExtractor={(veterinario) => String(veterinario.idVeterinario)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <VeterinarioCard veterinario={item} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          ) : isError ? (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>
                {getApiErrorMessage(
                  error,
                  'Não foi possível carregar os veterinários agora. Verifique sua conexão e tente novamente.'
                )}
              </Text>
            </View>
          ) : listaVazia ? (
            <View style={styles.messageBox}>
              <Text style={styles.emptyText}>Nenhum veterinário cadastrado na clínica ainda.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  avisoBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
  },
  avisoTexto: {
    fontSize: 13,
    color: COLORS.subtitle,
    lineHeight: 19,
    textAlign: 'center',
  },

  listContent: {
    flexGrow: 1,
    padding: 20,
  },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  messageBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    color: COLORS.subtitle,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.title,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.title,
  },
  cardDetalhe: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.subtitle,
  },
  cardCrmv: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.subtitle,
  },
});
