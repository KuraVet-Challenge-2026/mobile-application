import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { theme } from '../theme/colors';

export default function AppointmentScreen() {
  const [petName, setPetName] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horaConsulta, setHoraConsulta] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleDataMask = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDataConsulta(formatted);
  };

  const handleHoraMask = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setHoraConsulta(formatted);
  };

  const handleClear = () => {
    setPetName(''); setDataConsulta(''); setHoraConsulta(''); setMotivo('');
  };

  const handleSchedule = () => {
    if (!petName || !dataConsulta || !horaConsulta || !motivo) {
      Alert.alert('Erro', 'Preencha todos os campos do agendamento.');
      return;
    }
    Alert.alert('Agendamento Concluído', `Consulta do ${petName} marcada para dia ${dataConsulta} às ${horaConsulta}!`);
    handleClear();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Agendar Consulta</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput style={styles.input} value={petName} onChangeText={setPetName} placeholder="Ex: Thor" />

        <Text style={styles.label}>Data da Consulta</Text>
        <TextInput style={styles.input} value={dataConsulta} onChangeText={handleDataMask} placeholder="DD/MM/AAAA" keyboardType="numeric" maxLength={10} />

        <Text style={styles.label}>Horário</Text>
        <TextInput style={styles.input} value={horaConsulta} onChangeText={handleHoraMask} placeholder="HH:MM" keyboardType="numeric" maxLength={5} />

        <Text style={styles.label}>Motivo / Sintomas</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={motivo} onChangeText={setMotivo} placeholder="Descreva os sintomas..." multiline />

        <TouchableOpacity style={styles.button} onPress={handleSchedule}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClear} onPress={handleClear}>
          <Text style={styles.buttonClearText}>Limpar Campos</Text>
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
  input: { borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 8, padding: 12, marginBottom: 20, color: theme.colors.primary, backgroundColor: '#FFF' },
  button: { backgroundColor: theme.colors.secondary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 16 },
  buttonClear: { backgroundColor: 'transparent', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: theme.colors.primary },
  buttonClearText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 }
});