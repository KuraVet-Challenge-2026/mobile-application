import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { Sexo } from '../types';
import { usePet, useExcluirPet } from '../hooks/usePets';
import { getApiErrorMessage } from '../utils/apiErrorMessage';

type PetDetalheNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetDetalhe'>;
type PetDetalheRouteProp = RouteProp<RootStackParamList, 'PetDetalhe'>;

const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  title: '#1E4E79',
  subtitle: '#4C7EA8',
  error: '#B3261E',
  errorBg: '#F9DEDC',
};

const SEXO_LABEL: Record<Sexo, string> = { M: 'Macho', F: 'Fêmea' };

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      <Text style={styles.campoValor}>{valor}</Text>
    </View>
  );
}

// Tela de Read (detalhe) + entrada para Update/Delete do CRUD de Pet. GET /api/pets/{id}
// isolado em src/hooks/usePets.ts — 404 se o pet não existir ou não for do tutor autenticado
// (backend nunca revela pet de terceiro, ver docs/API_CONTRACT.md).
export default function PetDetalheScreen() {
  const navigation = useNavigation<PetDetalheNavigationProp>();
  const { params } = useRoute<PetDetalheRouteProp>();
  const { idPet } = params;

  const { data: pet, isLoading, isError, error } = usePet(idPet);
  const { mutate: excluir, isPending: isExcluindo } = useExcluirPet();

  function handleExcluir() {
    Alert.alert(
      'Excluir pet',
      `Tem certeza que deseja excluir ${pet?.nome ?? 'este pet'}? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            excluir(idPet, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: (erro) => {
                // Backend bloqueia exclusão de pet com consultas registradas (400, regra de
                // negócio) — a mensagem já vem pronta do ApiExceptionHandler, sem precisar
                // traduzir esse caso especificamente aqui.
                Alert.alert('Não foi possível excluir', getApiErrorMessage(erro));
              },
            });
          },
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !pet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.messageBox}>
          <Text style={styles.errorText}>
            {getApiErrorMessage(
              error,
              'Não foi possível carregar este pet agora. Verifique sua conexão e tente novamente.'
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{pet.nome.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.nome}>{pet.nome}</Text>

          <Campo label="Espécie" valor={pet.especie} />
          <Campo label="Raça" valor={pet.raca || 'Não informada'} />
          <Campo label="Sexo" valor={SEXO_LABEL[pet.sexo]} />
          <Campo label="Nascimento" valor={pet.dataNascimento} />
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EditarPet', { idPet })}
        >
          <Text style={styles.editButtonText}>EDITAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, isExcluindo && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={handleExcluir}
          disabled={isExcluindo}
        >
          {isExcluindo ? (
            <ActivityIndicator color={COLORS.error} />
          ) : (
            <Text style={styles.deleteButtonText}>EXCLUIR</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBox: {
    margin: 20,
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

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.title,
  },
  nome: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.title,
    marginBottom: 20,
  },

  campo: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    paddingVertical: 12,
  },
  campoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtitle,
    marginBottom: 2,
  },
  campoValor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333333',
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: COLORS.errorBg,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F3C6C3',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.error,
    letterSpacing: 0.5,
  },
});
