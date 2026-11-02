import React, { useMemo, useState } from 'react';
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
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

let logoSource: ImageSourcePropType | null = null;
try {
  logoSource = require('../../assets/logo.png');
} catch {
  logoSource = null;
}

export default function Login() {
  const navigation = useNavigation<LoginNavigationProp>();
  const { login } = useAuth();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErro, setFormErro] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  async function handleLogin() {
    if (isLoading) return;

    if (!username.trim() || !senha) {
      setFormErro('Informe usuário e senha para continuar.');
      return;
    }
    setFormErro('');

    setIsLoading(true);
    try {
      await login(username.trim(), senha);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.';
      setFormErro(mensagem);
      Alert.alert('Não foi possível entrar', mensagem);
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Entre para cuidar do seu pet</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Usuário</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Seu usuário"
                placeholderTextColor={colors.textMuted}
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
                  placeholder="Sua senha"
                  placeholderTextColor={colors.textMuted}
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

            {!!formErro && <Text style={styles.errorText}>{formErro}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.buttonText}>ENTRAR</Text>
              )}
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

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
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

    logo: {
      width: 140,
      height: 140,
      marginBottom: 16,
    },
    logoFallback: {
      width: 140,
      height: 140,
      borderRadius: 36,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    logoFallbackText: {
      fontSize: 22,
      fontWeight: '800',
      color: c.text,
    },

    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: c.card,
      borderRadius: 28,
      padding: 24,
      shadowColor: c.sombra,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
    },
    subtitle: {
      marginTop: 6,
      fontSize: 13,
      color: c.textMuted,
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
      color: c.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: c.card,
      borderWidth: 1.5,
      borderColor: c.primary,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: c.text,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1.5,
      borderColor: c.primary,
      borderRadius: 14,
      paddingHorizontal: 16,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 15,
      color: c.text,
    },
    passwordToggle: {
      fontSize: 12,
      fontWeight: '700',
      color: c.text,
      marginLeft: 8,
    },

    // ---- Feedback de validação ----
    errorText: {
      color: c.error,
      fontSize: 13,
      marginBottom: 12,
      textAlign: 'center',
    },

    // ---- Ações ----
    button: {
      backgroundColor: c.primary,
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
      color: c.text,
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
      color: c.text,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: '800',
      color: c.text,
      textDecorationLine: 'underline',
    },
  });
}
