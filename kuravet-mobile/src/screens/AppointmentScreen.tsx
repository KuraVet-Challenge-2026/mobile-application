import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { theme } from '../theme/colors';

export default function AppointmentScreen() {
  const [data, setData] = useState('');
  const [motivo, setMotivo] = useState('');

  // Lógica simples de Máscara para Data (DD/MM/AAAA)
  const handleDataChange = (text: string) => {
    let formatado = text.replace(/\D/g, ''); // Remove tudo o que não for número
    
    if (formatado.length > 2) {
      formatado = formatado.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (formatado.length > 5) {
      formatado = formatado.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    
    setData(formatado.substring(0, 10)); // Limita a 10 caracteres
  };

  const handleAgendar = () => {
    if (!data || !motivo) {
      Alert.alert('Atenção', 'Preencha a data e o motivo da consulta.');
      return;
    }
    Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
    setData('');
    setMotivo('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Agendar Consulta</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Data da Consulta</Text>
        <TextInput 
          style={styles.input} 
          value={data} 
          onChangeText={handleDataChange} 
          placeholder="DD/MM/AAAA" 
          keyboardType="numeric"
        />

        <Text style={styles.label}>Motivo</Text>
        <TextInput 
          style={styles.input} 
          value={motivo} 
          onChangeText={setMotivo} 
          placeholder="Ex: Vacina de rotina" 
        />

        <TouchableOpacity style={styles.button} onPress={handleAgendar}>
          <Text style={styles.buttonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginVertical: 20 },
  card: { backgroundColor: theme.colors.white, padding: 20, borderRadius: 12, elevation: 3 },
  label: { color: theme.colors.primary, fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  input: { borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 8, padding: 12, marginBottom: 20, color: theme.colors.primary },
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 16 }
});