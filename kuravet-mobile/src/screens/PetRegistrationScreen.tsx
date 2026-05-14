import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { theme } from '../theme/colors';

export default function PetRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');

  const handleRegister = () => {
    if (!nome || !especie) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    Alert.alert('Sucesso', `O pet ${nome} foi cadastrado localmente!`);
    setNome(''); setEspecie('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Adicionar Pet</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Rex" />
        <Text style={styles.label}>Espécie</Text>
        <TextInput style={styles.input} value={especie} onChangeText={setEspecie} placeholder="Ex: Cachorro" />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Salvar Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginVertical: 20 },
  card: { backgroundColor: theme.colors.white, padding: 20, borderRadius: 12, elevation: 3 },
  label: { color: theme.colors.primary, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 8, padding: 12, marginBottom: 20 },
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.white, fontWeight: 'bold' }
});