import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import { useAuth } from '../auth/AuthContext';
import { useCriarPet } from '../hooks/usePets';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import FormularioPet, { FORM_PET_COLORS } from '../components/FormularioPet';
import type { PetInput } from '../types';

type CadastroPetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CadastroPet'>;

export default function CadastroPet() {
  const navigation = useNavigation<CadastroPetNavigationProp>();
  const { usuario } = useAuth();
  const { mutate, isPending } = useCriarPet();

  function handleSubmit(payload: PetInput) {
    if (!usuario?.idTutor) {
      Alert.alert(
        'Perfil não encontrado',
        'Seu perfil de tutor não foi encontrado no sistema. Entre em contato com o suporte.'
      );
      return;
    }

    mutate(payload, {
      onSuccess: (petCriado) => {
        Alert.alert('Pet cadastrado!', `${petCriado.nome} foi cadastrado com sucesso.`, [
          { text: 'OK', onPress: () => navigation.navigate('PetsList') },
        ]);
      },
      onError: (error) => {
        Alert.alert('Não foi possível cadastrar', getApiErrorMessage(error));
      },
    });
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
          <FormularioPet onSubmit={handleSubmit} isPending={isPending} textoBotao="SALVAR PET" />
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
});
