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
import { signInWithEmailAndPassword } from 'firebase/auth';

import type { RootStackParamList } from '../routes';
import { auth } from '../config/firebaseConfig';
import { getFirebaseAuthErrorMessage } from '../utils/firebaseErrorMessage';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// Paleta oficial do KuraVet — mantida estritamente para as telas de autenticação.
const COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  text: '#333333',
  textMuted: '#666666',
};

// `require` de asset é resolvido estaticamente pelo Metro; o try/catch cobre o
// cenário de o arquivo ser removido do projeto futuramente sem quebrar o bundle,
// e o estado `logoFailed` (via `onError`) cobre falha em runtime (ex.: arquivo
// corrompido). Com os dois, a logo nunca derruba a tela.
let logoSource: ImageSourcePropType | null = null;
try {
  logoSource = require('../../assets/logo.png');
} catch {
  logoSource = null;
}

export default function Login() {
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  async function handleLogin() {
    if (isLoading) return;

    if (!email.trim() || !senha) {
      Alert.alert('Campos obrigatórios', 'Informe e-mail e senha para continuar.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);

      // `reset` em vez de `navigate`: depois de logado, o botão "voltar" do
      // dispositivo não deve levar o usuário de volta para a tela de Login.
      // Não zeramos `isLoading` aqui de propósito: a tela é desmontada pela
      // navegação, então não há necessidade (e evita setState após unmount).
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Não foi possível entrar', getFirebaseAuthErrorMessage(error));
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Entre para cuidar do seu pet</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
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
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Sua senha"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!senhaVisivel}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel((v) => !v)} hitSlop={8}>
                  <Text style={styles.passwordToggle}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.buttonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              activeOpacity={0.7}
              // TODO: navegar para o fluxo de recuperação de senha quando existir.
              onPress={() => {}}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Novo por aqui? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} hitSlop={8}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
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
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: COLORS.textMuted,
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
