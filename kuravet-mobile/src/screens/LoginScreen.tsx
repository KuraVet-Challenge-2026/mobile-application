import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KuraVet</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="E-mail do Tutor"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity style={styles.button} onPress={() => login(email, senha)}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: theme.colors.white, padding: 25, borderRadius: 15, elevation: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: theme.colors.primary, marginBottom: 25, paddingVertical: 10, fontSize: 16 },
  button: { backgroundColor: theme.colors.secondary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' }
});