import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { Pet } from '../types';
import { usePets } from '../hooks/usePets';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type PetsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetsList'>;

type EstilosPetsList = ReturnType<typeof criarEstilos>;

function PetCard({
  pet,
  onPress,
  styles,
}: {
  pet: Pet;
  onPress: () => void;
  styles: EstilosPetsList;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{pet.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome} numberOfLines={1}>
          {pet.nome}
        </Text>
        <Text style={styles.cardDetalhe} numberOfLines={1}>
          {pet.especie}
          {pet.raca ? ` · ${pet.raca}` : ''}
        </Text>
      </View>
      <Text style={styles.chevron}>&gt;</Text>
    </TouchableOpacity>
  );
}

export default function PetsListScreen() {
  const navigation = useNavigation<PetsListNavigationProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);
  const { data: pets, isLoading, isError, error, isFetching, refetch } = usePets();

  const listaVazia = !isLoading && !isError && (!pets || pets.length === 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={pets ?? []}
        keyExtractor={(pet) => String(pet.idPet)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => navigation.navigate('PetDetalhe', { idPet: item.idPet })}
            styles={styles}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : isError ? (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>
                {getApiErrorMessage(
                  error,
                  'Não foi possível carregar seus pets agora. Verifique sua conexão e tente novamente.'
                )}
              </Text>
            </View>
          ) : listaVazia ? (
            <View style={styles.messageBox}>
              <Text style={styles.emptyText}>
                Você ainda não tem pets cadastrados. Toque em &quot;+ Novo Pet&quot; para adicionar
                o primeiro.
              </Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CadastroPet')}
      >
        <Text style={styles.addButtonText}>+ Novo Pet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
    },
    listContent: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: 96,
    },

    centerBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    messageBox: {
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
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
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
      marginRight: 10,
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
    chevron: {
      fontSize: 20,
      fontWeight: '600',
      color: c.iconeSutil,
    },

    addButton: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 20,
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.title,
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 4,
    },
    addButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: c.text,
      letterSpacing: 0.5,
    },
  });
}
