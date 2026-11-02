import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { Pet } from '../types';
import { usePets } from '../hooks/usePets';
import { useCriarTriagem } from '../hooks/useTriagens';
import { RELATO_MAX_LENGTH, RELATO_MIN_LENGTH } from '../services/triagemRegras';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import ResultadoTriagem from '../components/ResultadoTriagem';

type TriagemNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Triagem'>;
type TriagemRouteProp = RouteProp<RootStackParamList, 'Triagem'>;

export default function TriagemScreen() {
  const navigation = useNavigation<TriagemNavigationProp>();
  const route = useRoute<TriagemRouteProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);
  const chipStyles = useMemo(() => criarEstilosChip(colors), [colors]);

  const { data: pets, isLoading: isLoadingPets, isError: isErrorPets } = usePets();
  const mutation = useCriarTriagem();

  const [idPetSelecionado, setIdPetSelecionado] = useState<number | undefined>(
    route.params?.idPet
  );
  const [relato, setRelato] = useState('');

  const relatoTrimado = relato.trim();
  const relatoValido =
    relatoTrimado.length >= RELATO_MIN_LENGTH && relatoTrimado.length <= RELATO_MAX_LENGTH;
  const podeEnviar = idPetSelecionado !== undefined && relatoValido && !mutation.isPending;

  function handleEnviar() {
    if (!podeEnviar || idPetSelecionado === undefined) return;
    mutation.mutate({ idPet: idPetSelecionado, relato: relatoTrimado });
  }

  function handleNovaTriagem() {
    setRelato('');
    mutation.reset();
  }

  if (isLoadingPets) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isErrorPets) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.messageBox}>
          <Text style={styles.errorText}>
            Não foi possível carregar seus pets agora. Verifique sua conexão e tente novamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.messageBox}>
          <Text style={styles.emptyText}>
            Você ainda não tem pets cadastrados. Cadastre um pet para poder fazer uma triagem.
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroPet')}
          >
            <Text style={styles.buttonText}>CADASTRAR PET</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (mutation.isSuccess && mutation.data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ResultadoTriagem triagem={mutation.data} />

          <TouchableOpacity
            style={styles.buttonSecundario}
            activeOpacity={0.8}
            onPress={handleNovaTriagem}
          >
            <Text style={styles.buttonSecundarioText}>NOVA TRIAGEM</Text>
          </TouchableOpacity>
        </ScrollView>
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
          <Text style={styles.titulo}>Triagem por IA</Text>
          <Text style={styles.subtitulo}>Escolha o pet e descreva os sintomas observados</Text>

          <Text style={styles.label}>Pet</Text>
          <View style={styles.chipsRow}>
            {pets.map((pet) => (
              <ChipPet
                key={pet.idPet}
                pet={pet}
                selecionado={pet.idPet === idPetSelecionado}
                styles={chipStyles}
                onPress={() => setIdPetSelecionado(pet.idPet)}
              />
            ))}
          </View>

          <Text style={styles.label}>Relato</Text>
          <TextInput
            style={styles.textarea}
            value={relato}
            onChangeText={setRelato}
            placeholder="Descreva os sintomas que o pet está apresentando..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={RELATO_MAX_LENGTH}
            textAlignVertical="top"
          />
          <Text style={styles.contador}>
            {relato.length}/{RELATO_MAX_LENGTH}
          </Text>

          {mutation.isError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {getApiErrorMessage(
                  mutation.error,
                  'Não foi possível concluir a triagem agora. Tente novamente.'
                )}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, !podeEnviar && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleEnviar}
            disabled={!podeEnviar}
          >
            {mutation.isPending ? (
              <View style={styles.pendingRow}>
                <ActivityIndicator color={colors.text} />
                <Text style={styles.buttonText}>
                  Analisando o relato… pode levar alguns segundos
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>ENVIAR</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChipPet({
  pet,
  selecionado,
  styles,
  onPress,
}: {
  pet: Pet;
  selecionado: boolean;
  styles: ReturnType<typeof criarEstilosChip>;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selecionado && styles.chipSelecionado]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.chipTexto}>{pet.nome}</Text>
    </TouchableOpacity>
  );
}

function criarEstilosChip(c: PaletaCores) {
  return StyleSheet.create({
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.primary,
      backgroundColor: c.card,
      marginRight: 10,
      marginBottom: 10,
    },
    chipSelecionado: {
      backgroundColor: c.primary,
    },
    chipTexto: {
      fontSize: 14,
      fontWeight: '700',
      color: c.text,
    },
  });
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 32 },
    centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    messageBox: {
      margin: 20,
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    errorText: { color: c.error, fontSize: 14, textAlign: 'center', lineHeight: 20 },
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    errorBox: {
      backgroundColor: c.errorBackground,
      borderRadius: 14,
      padding: 14,
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.errorBorder,
    },

    titulo: { fontSize: 22, fontWeight: '800', color: c.title, textAlign: 'center' },
    subtitulo: {
      marginTop: 6,
      fontSize: 13,
      color: c.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },

    label: { fontSize: 13, fontWeight: '700', color: c.text, marginBottom: 10, marginTop: 8 },

    chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },

    textarea: {
      backgroundColor: c.card,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      fontSize: 15,
      color: c.text,
      minHeight: 120,
    },
    contador: {
      alignSelf: 'flex-end',
      marginTop: 6,
      fontSize: 12,
      color: c.textMuted,
    },

    button: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { fontSize: 15, fontWeight: '800', color: c.text, letterSpacing: 0.3 },
    pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },

    buttonSecundario: {
      backgroundColor: c.card,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      borderWidth: 1.5,
      borderColor: c.primary,
    },
    buttonSecundarioText: { fontSize: 15, fontWeight: '800', color: c.title, letterSpacing: 0.3 },
  });
}
