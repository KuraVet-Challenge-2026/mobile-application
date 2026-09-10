import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import { useAuth } from '../auth/AuthContext';

type CadastroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

// Paleta oficial do KuraVet — mantida estritamente para as telas de autenticação
// (idêntica à de src/screens/Login.tsx, para preservar a mesma identidade visual).
const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  text: '#333333',
  textMuted: '#666666',
};

// Ver comentário equivalente em Login.tsx: try/catch cobre o asset sendo removido
// do projeto, `onError` (mais abaixo) cobre falha de decodificação em runtime.
let logoSource: ImageSourcePropType | null = null;
try {
  logoSource = require('../../assets/logo.png');
} catch {
  logoSource = null;
}

// E-mail é opcional no contrato de POST /api/auth/cadastro — só validamos o formato quando
// algo foi digitado (ver docs/API_CONTRACT.md).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  const navigation = useNavigation<CadastroNavigationProp>();
  const { cadastro } = useAuth();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  async function handleCadastro() {
    if (isLoading) return;

    if (!nome.trim() || !cpf.trim() || !username.trim() || !senha || !confirmarSenha) {
      setErro('Preencha nome, CPF, usuário e senha para continuar.');
      return;
    }
    // Validação frouxa de formato (só a contagem de dígitos): a API não documenta uma máscara
    // exigida (ver PetRequestDTO/TutorRequestDTO em docs/API_CONTRACT.md), só que o campo é
    // obrigatório — aqui só evitamos mandar um CPF obviamente incompleto.
    if (cpf.replace(/\D/g, '').length !== 11) {
      setErro('Informe um CPF válido (11 dígitos).');
      return;
    }
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setErro('Informe um e-mail válido ou deixe o campo em branco.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setErro('');

    setIsLoading(true);
    try {
      // cadastro() chama POST /api/auth/cadastro e, em caso de sucesso, já reaproveita login()
      // com as mesmas credenciais (ver src/auth/AuthContext.tsx) — persiste a sessão e atualiza
      // o `status` do AuthContext. Não navegamos manualmente: RootNavigator troca sozinho de
      // stack quando `status` vira 'autenticado' (mesmo raciocínio de Login.tsx).
      await cadastro({
        nome: nome.trim(),
        cpf: cpf.trim(),
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
        username: username.trim(),
        senha,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Não foi possível cadastrar. Tente novamente.';
      // Alert.alert é um no-op silencioso no Expo Web (react-native-web substitui o módulo por
      // uma função vazia — não existe diálogo nativo no browser) — sem o texto inline abaixo,
      // qualquer falha de rede/timeout/API nessa plataforma fazia o botão só voltar do loading
      // sem nenhum feedback, como se nada tivesse acontecido. Mantemos Alert.alert para
      // iOS/Android (onde funciona normalmente) e duplicamos em `erro`, que é sempre visível.
      setErro(mensagem);
      Alert.alert('Não foi possível cadastrar', mensagem);
    } finally {
      setIsLoading(false);
    }
  }

  const mostrarLogo = !!logoSource && !logoFailed;

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
          {mostrarLogo ? (
            <Image
              source={logoSource as ImageSourcePropType}
              style={styles.logo}
              resizeMode="contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>KuraVet</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Crie sua conta para começar</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
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
              <Text style={styles.label}>E-mail (opcional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
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
                autoComplete="tel"
                textContentType="telephoneNumber"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Usuário</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Como você vai entrar no app"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoComplete="username"
                textContentType="username"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!senhaVisivel}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  textContentType="newPassword"
                  returnKeyType="next"
                />
                <TouchableOpacity onPress={() => setSenhaVisivel((v) => !v)} hitSlop={8}>
                  <Text style={styles.passwordToggle}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Repita a senha"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleCadastro}
              />
            </View>

            {!!erro && <Text style={styles.errorText}>{erro}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleCadastro}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.buttonText}>CADASTRAR</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.footerLink}>Login</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // ---- Logo ----
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  logoFallback: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoFallbackText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  // ---- Card central (flat shadow) ----
  card: {
    width: '100%',
    maxWidth: 400,
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
    fontSize: 26,
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  passwordToggle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
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

  // ---- Rodapé ----
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    textDecorationLine: 'underline',
  },
});
