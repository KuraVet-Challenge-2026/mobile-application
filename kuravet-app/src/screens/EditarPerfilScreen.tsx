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

import type { RootStackParamList } from '../routes';
import { useAuth } from '../auth/AuthContext';
import { useTutor, useAtualizarTutor } from '../hooks/useTutores';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import type { TutorInput } from '../types';

type EditarPerfilNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditarPerfil'>;

const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  text: '#333333',
  textMuted: '#666666',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditarPerfilScreen() {
  const navigation = useNavigation<EditarPerfilNavigationProp>();
  const { usuario } = useAuth();
  const idTutor = usuario?.idTutor ?? undefined;

  const { data: tutor, isLoading, isError, error } = useTutor(idTutor);
  const { mutate, isPending } = useAtualizarTutor();

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : isError || !tutor ? (
        <View style={styles.messageBox}>
          <Text style={styles.errorText}>
            {getApiErrorMessage(
              error,
              'Não foi possível carregar seus dados agora. Verifique sua conexão e tente novamente.'
            )}
          </Text>
        </View>
      ) : (
        <FormularioPerfil
          key={tutor.idTutor}
          tutor={tutor}
          idTutor={idTutor as number}
          isPending={isPending}
          onSubmit={(payload) =>
            mutate(
              { idTutor: idTutor as number, payload },
              {
                onSuccess: () => {
                  Alert.alert('Perfil atualizado!', 'Seus dados foram salvos com sucesso.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                },
                onError: (erro) => {
                  Alert.alert('Não foi possível salvar', getApiErrorMessage(erro));
                },
              }
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

function FormularioPerfil({
  tutor,
  isPending,
  onSubmit,
}: {
  tutor: { nome: string; cpf: string; telefone: string | null; email: string | null; endereco: string | null };
  idTutor: number;
  isPending: boolean;
  onSubmit: (payload: TutorInput) => void;
}) {
  const [nome, setNome] = useState(tutor.nome);
  const [cpf, setCpf] = useState(tutor.cpf);
  const [telefone, setTelefone] = useState(tutor.telefone ?? '');
  const [email, setEmail] = useState(tutor.email ?? '');
  const [endereco, setEndereco] = useState(tutor.endereco ?? '');
  const [formErro, setFormErro] = useState('');

  function handleSalvar() {
    if (isPending) return;

    if (!nome.trim() || !cpf.trim()) {
      setFormErro('Preencha nome e CPF para continuar.');
      return;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      setFormErro('Informe um CPF válido (11 dígitos).');
      return;
    }
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setFormErro('Informe um e-mail válido ou deixe o campo em branco.');
      return;
    }
    setFormErro('');

    onSubmit({
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      endereco: endereco.trim() || undefined,
    });
  }

  return (
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
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>Atualize seus dados de tutor</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
              placeholderTextColor={COLORS.textMuted}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Telefone (opcional)</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(11) 91234-5601"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail (opcional)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Endereço (opcional)</Text>
            <TextInput
              style={styles.input}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número - Cidade/UF"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSalvar}
            />
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
              <Text style={styles.buttonText}>SALVAR ALTERAÇÕES</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

  errorText: {
    color: '#B3261E',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },

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
