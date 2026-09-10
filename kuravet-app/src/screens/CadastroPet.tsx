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

// Tela de Create do CRUD de Pet — só orquestra navegação/mutation/feedback; o formulário em si
// (campos, validação) fica em src/components/FormularioPet.tsx, compartilhado com
// EditarPetScreen.tsx (Update). Nenhuma chamada HTTP aqui (CLAUDE.md regra 2) — tudo passa por
// useCriarPet (src/hooks/usePets.ts).
export default function CadastroPet() {
  const navigation = useNavigation<CadastroPetNavigationProp>();
  // O dono do pet é sempre o TUTOR autenticado — a API resolve isso a partir do header
  // Authorization (POST /pets não aceita idTutor no corpo, ver docs/API_CONTRACT.md). `usuario`
  // vem de GET /api/auth/me (src/auth/AuthContext.tsx). Conferimos aqui antes de submeter: sem
  // idTutor, nem vale tentar — evita um 400/403 confuso vindo do backend por um estado que o app
  // já sabia ser inválido.
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
