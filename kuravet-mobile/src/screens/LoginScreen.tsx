import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

export default function LoginScreen() {
  const { login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Controla se estamos a cadastrar ou a entrar

  const handleAction = async () => {
    setIsLoading(true);
    
    if (isRegisterMode) {
      // Executa o Cadastro
      setTimeout(async () => {
        const success = await register(email, senha);
        if (success) {
          setIsRegisterMode(false); 
          setSenha(''); 
        }
        setIsLoading(false);
      }, 1000);
    } else {
      // Executa o Login
      setTimeout(() => {
        login(email, senha);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>KuraVet</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>
          {isRegisterMode ? 'Criar Nova Conta' : 'Acesse sua Conta'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail do Tutor"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {isRegisterMode ? 'Cadastrar' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        {/* alternar entre Login e Cadastro */}
        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => {
            setIsRegisterMode(!isRegisterMode);
            setSenha(''); 
          }}
        >
          <Text style={styles.switchButtonText}>
            {isRegisterMode 
              ? 'Já tem uma conta? Faça Login' 
              : 'Não tem conta? Cadastre-se'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 18, color: theme.colors.primary, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  card: { backgroundColor: theme.colors.white, padding: 25, borderRadius: 15, elevation: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: theme.colors.primary, marginBottom: 25, paddingVertical: 10, fontSize: 16 },
  button: { backgroundColor: theme.colors.secondary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' },
  switchButton: { marginTop: 20, alignItems: 'center' },
  switchButtonText: { color: theme.colors.primary, fontWeight: 'bold' }
});