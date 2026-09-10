import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import { usePet, useAtualizarPet } from '../hooks/usePets';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import FormularioPet, { FORM_PET_COLORS } from '../components/FormularioPet';
import type { PetInput } from '../types';

type EditarPetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditarPet'>;
type EditarPetRouteProp = RouteProp<RootStackParamList, 'EditarPet'>;

// Tela de Update do CRUD de Pet. GET /api/pets/{id} para carregar os valores atuais (mesma
// query key de PetDetalheScreen.tsx, ver src/hooks/usePets.ts — normalmente já está em cache) e
// PUT /api/pets/{id} para salvar (useAtualizarPet). Formulário compartilhado com CadastroPet.tsx
// (src/components/FormularioPet.tsx) — mesma validação de campo nos dois fluxos.
export default function EditarPetScreen() {
  const navigation = useNavigation<EditarPetNavigationProp>();
  const { params } = useRoute<EditarPetRouteProp>();
  const { idPet } = params;

  const { data: pet, isLoading, isError, error } = usePet(idPet);
  const { mutate, isPending } = useAtualizarPet();

  function handleSubmit(payload: PetInput) {
    mutate(
      { idPet, payload },
      {
        onSuccess: (petAtualizado) => {
          Alert.alert('Pet atualizado!', `As informações de ${petAtualizado.nome} foram salvas.`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (erro) => {
          Alert.alert('Não foi possível salvar', getApiErrorMessage(erro));
        },
      }
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator color={FORM_PET_COLORS.primary} size="large" />
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* `key`: se o param idPet mudasse sem desmontar a tela (não acontece pela navegação
              atual, mas evita a armadilha), força o formulário a reinicializar os valores a
              partir do pet novo em vez de continuar com o estado interno do pet anterior. O
              formulário nasce direto de `pet` via useState(initializer) dentro de
              FormularioPet — sem useEffect+setState espelhando a resposta da API (o mesmo tipo
              de problema já pego pelo lint como V8, ver docs/AUDITORIA.md). */}
          <FormularioPet
            key={pet.idPet}
            titulo="Editar Pet"
            subtitulo="Atualize as informações do seu companheiro"
            valoresIniciais={{
              nome: pet.nome,
              especie: pet.especie,
              raca: pet.raca,
              sexo: pet.sexo,
              dataNascimento: pet.dataNascimento,
            }}
            onSubmit={handleSubmit}
            isPending={isPending}
            textoBotao="SALVAR ALTERAÇÕES"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FORM_PET_COLORS.background,
  },
  flex: {
    flex: 1,
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
    backgroundColor: FORM_PET_COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  errorText: {
    color: '#B3261E',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
