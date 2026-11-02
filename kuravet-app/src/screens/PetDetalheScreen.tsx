import React, { useMemo } from 'react';
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
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type PetDetalheNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetDetalhe'>;
type PetDetalheRouteProp = RouteProp<RootStackParamList, 'PetDetalhe'>;

type EstilosPetDetalhe = ReturnType<typeof criarEstilos>;

const SEXO_LABEL: Record<Sexo, string> = { M: 'Macho', F: 'Fêmea' };

function Campo({ label, valor, styles }: { label: string; valor: string; styles: EstilosPetDetalhe }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      <Text style={styles.campoValor}>{valor}</Text>
    </View>
  );
}

export default function PetDetalheScreen() {
  const navigation = useNavigation<PetDetalheNavigationProp>();
  const { params } = useRoute<PetDetalheRouteProp>();
  const { idPet } = params;
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

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
          <ActivityIndicator color={colors.primary} size="large" />
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

          <Campo label="Espécie" valor={pet.especie} styles={styles} />
          <Campo label="Raça" valor={pet.raca || 'Não informada'} styles={styles} />
          <Campo label="Sexo" valor={SEXO_LABEL[pet.sexo]} styles={styles} />
          <Campo label="Nascimento" valor={pet.dataNascimento} styles={styles} />
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Triagem', { idPet })}
        >
          <Text style={styles.editButtonText}>FAZER TRIAGEM</Text>
        </TouchableOpacity>

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
            <ActivityIndicator color={colors.error} />
          ) : (
            <Text style={styles.deleteButtonText}>EXCLUIR</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
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
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
    },
    errorText: {
      color: c.error,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },

    card: {
      backgroundColor: c.card,
      borderRadius: 28,
      padding: 24,
      alignItems: 'center',
      shadowColor: c.sombra,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 26,
      fontWeight: '800',
      color: c.title,
    },
    nome: {
      fontSize: 22,
      fontWeight: '800',
      color: c.title,
      marginBottom: 20,
    },

    campo: {
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: c.primary,
      paddingVertical: 12,
    },
    campoLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textSecondary,
      marginBottom: 2,
    },
    campoValor: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },

    editButton: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    editButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: c.text,
      letterSpacing: 0.5,
    },
    deleteButton: {
      backgroundColor: c.errorBackground,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.errorBorder,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    deleteButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: c.error,
      letterSpacing: 0.5,
    },
  });
}
