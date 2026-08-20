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
import { useMutation, useQuery } from '@tanstack/react-query';

import type { RootStackParamList } from '../routes';
import api from '../services/api';
import { auth } from '../config/firebaseConfig';
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

const SEXOS = ['M', 'F'] as const;
type Sexo = (typeof SEXOS)[number];

const DATA_NASCIMENTO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Formato "cru" que a API de tutores pode devolver — o backend Java ainda não
// tem um contrato 100% fechado, então aceitamos algumas variações de nome de
// campo (mesmo espírito defensivo já usado em Home.tsx para /consultas).
type TutorApi = {
  id?: number | string;
  idTutor?: number | string;
  nome?: string;
  nomeCompleto?: string;
  name?: string;
  email?: string;
};

type Tutor = {
  id: number;
  nome: string;
  email: string;
};

// GET /tutores — usada apenas para o "match silencioso" abaixo (encontrar o
// tutor logado pelo e-mail do Firebase). A lista NUNCA é exibida na tela: em
// um app de teleconsulta voltado ao tutor final, mostrar um seletor com todos
// os tutores cadastrados seria um vazamento de dados de outras pessoas.
// Tutores sem e-mail são descartados aqui, já que nunca poderiam ser
// encontrados pelo match e só atrapalhariam a busca.
async function fetchTutores(): Promise<Tutor[]> {
  const { data } = await api.get<TutorApi[]>('/tutores');
  if (!Array.isArray(data)) return [];

  return data.reduce<Tutor[]>((tutores, item) => {
    const idBruto = item.id ?? item.idTutor;
    const id = typeof idBruto === 'string' ? Number(idBruto) : idBruto;
    const nome = item.nome ?? item.nomeCompleto ?? item.name;

    if (typeof id === 'number' && Number.isFinite(id) && nome && item.email) {
      tutores.push({ id, nome, email: item.email });
    }
    return tutores;
  }, []);
}

type NovoPetPayload = {
  nome: string;
  especie: Especie;
  raca: string;
  peso: number;
  sexo: Sexo;
  dataNascimento: string;
  idTutor: number;
};

export default function CadastroPet() {
  const navigation = useNavigation<CadastroPetNavigationProp>();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<Especie | null>(null);
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [dataNascimento, setDataNascimento] = useState('');
  const [formErro, setFormErro] = useState('');

  const {
    data: tutores,
    isLoading: isLoadingTutores,
    isError: isErrorTutores,
  } = useQuery({
    queryKey: ['tutores'],
    queryFn: fetchTutores,
  });

  function limparFormulario() {
    setNome('');
    setEspecie(null);
    setRaca('');
    setPeso('');
    setSexo(null);
    setDataNascimento('');
    setFormErro('');
  }

  // POST /pets — ajuste a rota caso o backend Java exponha outro caminho
  // (ex.: '/animais'). Payload 100% dinâmico: cada campo vem de um estado
  // preenchido pelo usuário, sem nenhum valor mockado (ex.: idTutor fixo).
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

    if (!nome.trim() || !especie || !raca.trim() || !peso.trim() || !sexo) {
      setFormErro('Preencha todos os campos para continuar.');
      return;
    }
    if (!DATA_NASCIMENTO_REGEX.test(dataNascimento) || Number.isNaN(new Date(dataNascimento).getTime())) {
      setFormErro('Informe a data de nascimento no formato AAAA-MM-DD.');
      return;
    }

    const pesoNumero = Number(peso.replace(',', '.'));
    if (!Number.isFinite(pesoNumero) || pesoNumero <= 0) {
      setFormErro('Informe um peso válido.');
      return;
    }

    if (isLoadingTutores) {
      setFormErro('Aguarde um instante enquanto carregamos seu perfil.');
      return;
    }
    if (isErrorTutores || !tutores) {
      setFormErro('Não foi possível validar seu perfil de tutor. Tente novamente.');
      return;
    }

    // Match silencioso: identifica o tutor logado pelo e-mail do Firebase
    // Auth, sem nunca exibir a lista de tutores na tela (ver comentário em
    // fetchTutores). Comparação normalizada (trim + lowercase) porque e-mail
    // é, na prática, case-insensitive — evita falso-negativo por diferença de
    // maiúsculas entre o Firebase e o cadastro no Oracle.
    const emailLogado = auth.currentUser?.email?.trim().toLowerCase();
    const tutorLogado = emailLogado
      ? tutores.find((tutor) => tutor.email.trim().toLowerCase() === emailLogado)
      : undefined;

    if (!tutorLogado) {
      Alert.alert(
        'Perfil não encontrado',
        'Seu perfil de tutor não foi encontrado no sistema. Entre em contato com o suporte.'
      );
      return;
    }
    setFormErro('');

    mutate({
      nome: nome.trim(),
      especie,
      raca: raca.trim(),
      peso: pesoNumero,
      sexo,
      dataNascimento,
      idTutor: tutorLogado.id,
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
              <View style={styles.toggleRow}>
                {ESPECIES.map((opcao) => {
                  const selecionada = especie === opcao;
                  return (
                    <TouchableOpacity
                      key={opcao}
                      style={[styles.toggleOption, selecionada && styles.toggleOptionSelecionada]}
                      activeOpacity={0.8}
                      onPress={() => setEspecie(opcao)}
                    >
                      <Text style={styles.toggleIcon}>{opcao === 'Cachorro' ? '🐶' : '🐱'}</Text>
                      <Text style={styles.toggleLabel}>{opcao}</Text>
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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.toggleRow}>
                {SEXOS.map((opcao) => {
                  const selecionado = sexo === opcao;
                  return (
                    <TouchableOpacity
                      key={opcao}
                      style={[styles.toggleOption, selecionado && styles.toggleOptionSelecionada]}
                      activeOpacity={0.8}
                      onPress={() => setSexo(opcao)}
                    >
                      <Text style={styles.toggleLabel}>{opcao === 'M' ? 'Macho' : 'Fêmea'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowField]}>
                <Text style={styles.label}>Nascimento</Text>
                <TextInput
                  style={styles.input}
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                  maxLength={10}
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
                  returnKeyType="next"
                />
              </View>
            </View>

            {!!formErro && <Text style={styles.errorText}>{formErro}</Text>}

            <TouchableOpacity
              style={[styles.button, (isPending || isLoadingTutores) && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleSalvar}
              disabled={isPending || isLoadingTutores}
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

  // ---- Seletores tipo "toggle" (Espécie, Sexo) ----
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleOption: {
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
  toggleOptionSelecionada: {
    backgroundColor: COLORS.primary,
  },
  toggleIcon: {
    fontSize: 18,
  },
  toggleLabel: {
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
