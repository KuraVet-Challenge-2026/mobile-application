import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import type { RootStackParamList } from '../routes';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrorMessage';

type CadastroPetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CadastroPet'>;

// Paleta oficial do KuraVet — mesma identidade visual das telas de autenticação.
const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  text: '#333333',
  textMuted: '#666666',
};

const ESPECIES = ['Cachorro', 'Gato'] as const;
type Especie = (typeof ESPECIES)[number];

type NovoPetPayload = {
  nome: string;
  especie: Especie;
  raca: string;
  idade: number;
  peso: number;
};

export default function CadastroPet() {
  const navigation = useNavigation<CadastroPetNavigationProp>();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<Especie | null>(null);
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [formErro, setFormErro] = useState('');

  function limparFormulario() {
    setNome('');
    setEspecie(null);
    setRaca('');
    setIdade('');
    setPeso('');
    setFormErro('');
  }

  // POST /pets — ajuste a rota caso o backend Java exponha outro caminho
  // (ex.: '/animais'). O payload segue os campos coletados no formulário.
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: NovoPetPayload) => api.post('/pets', payload).then((res) => res.data),
    onSuccess: () => {
      const nomeCadastrado = nome.trim();
      limparFormulario();
      Alert.alert('Pet cadastrado!', `${nomeCadastrado} foi cadastrado com sucesso.`, [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    },
    onError: (error) => {
      Alert.alert('Não foi possível cadastrar', getApiErrorMessage(error));
    },
  });

  function handleSalvar() {
    if (isPending) return;

    if (!nome.trim() || !especie || !raca.trim() || !idade.trim() || !peso.trim()) {
      setFormErro('Preencha todos os campos para continuar.');
      return;
    }

    const idadeNumero = Number(idade.replace(',', '.'));
    const pesoNumero = Number(peso.replace(',', '.'));
    if (!Number.isFinite(idadeNumero) || idadeNumero < 0) {
      setFormErro('Informe uma idade válida.');
      return;
    }
    if (!Number.isFinite(pesoNumero) || pesoNumero <= 0) {
      setFormErro('Informe um peso válido.');
      return;
    }
    setFormErro('');

    mutate({
      nome: nome.trim(),
      especie,
      raca: raca.trim(),
      idade: idadeNumero,
      peso: pesoNumero,
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
          <View style={styles.card}>
            <Text style={styles.title}>Dados do Pet</Text>
            <Text style={styles.subtitle}>Conte um pouco sobre o seu companheiro</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome do Pet</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Ex.: Thor"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Espécie</Text>
              <View style={styles.especieRow}>
                {ESPECIES.map((opcao) => {
                  const selecionada = especie === opcao;
                  return (
                    <TouchableOpacity
                      key={opcao}
                      style={[styles.especieOption, selecionada && styles.especieOptionSelecionada]}
                      activeOpacity={0.8}
                      onPress={() => setEspecie(opcao)}
                    >
                      <Text style={styles.especieIcon}>{opcao === 'Cachorro' ? '🐶' : '🐱'}</Text>
                      <Text style={styles.especieLabel}>{opcao}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Raça</Text>
              <TextInput
                style={styles.input}
                value={raca}
                onChangeText={setRaca}
                placeholder="Ex.: Golden Retriever"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowField]}>
                <Text style={styles.label}>Idade (anos)</Text>
                <TextInput
                  style={styles.input}
                  value={idade}
                  onChangeText={setIdade}
                  placeholder="Ex.: 3"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.fieldGroup, styles.rowField]}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={peso}
                  onChangeText={setPeso}
                  placeholder="Ex.: 12.5"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSalvar}
                />
              </View>
            </View>

            {!!formErro && <Text style={styles.errorText}>{formErro}</Text>}

            <TouchableOpacity
              style={[styles.button, isPending && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleSalvar}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.buttonText}>SALVAR PET</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // ---- Card do formulário ----
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },

  // ---- Formulário ----
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },

  // ---- Seletor de espécie ----
  especieRow: {
    flexDirection: 'row',
    gap: 12,
  },
  especieOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  especieOptionSelecionada: {
    backgroundColor: COLORS.primary,
  },
  especieIcon: {
    fontSize: 18,
  },
  especieLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  // ---- Feedback de validação ----
  errorText: {
    color: '#B3261E',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },

  // ---- Ações ----
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
});
