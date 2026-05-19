import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';

export default function AppointmentScreen() {
  const [petName, setPetName] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horaConsulta, setHoraConsulta] = useState('');
  const [motivo, setMotivo] = useState('');

  const [appointments, setAppointments] = useState<any[]>([]);

  // Carrega os agendamentos guardados
  useEffect(() => {
    async function loadAppointments() {
      const stored = await AsyncStorage.getItem('@KuraVet:appointments');
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    }
    loadAppointments();
  }, []);

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

  // Guardar Agendamento
  const handleSchedule = async () => {
    if (!petName || !dataConsulta || !horaConsulta || !motivo) {
      Alert.alert('Erro', 'Preencha todos os campos do agendamento.');
      return;
    }

    const newAppointment = {
      id: String(Date.now()),
      petName,
      dataConsulta,
      horaConsulta,
      motivo
    };

    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    await AsyncStorage.setItem('@KuraVet:appointments', JSON.stringify(updated));

    Alert.alert('Agendamento Concluído', `Consulta do ${petName} marcada para o dia ${dataConsulta}!`);
    handleClear();
  };

  // Cancelar/Remover Agendamento
  const handleCancelAppointment = (id: string, name: string) => {
    Alert.alert(
      'Cancelar Consulta',
      `Tem a certeza que deseja cancelar a consulta do(a) ${name}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          style: 'destructive',
          onPress: async () => {
            const updated = appointments.filter(app => app.id !== id);
            setAppointments(updated);
            await AsyncStorage.setItem('@KuraVet:appointments', JSON.stringify(updated));
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Agendar Consulta</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput style={styles.input} value={petName} onChangeText={setPetName} placeholder="Ex: Thor" placeholderTextColor="#999" />

        <Text style={styles.label}>Data da Consulta</Text>
        <TextInput style={styles.input} value={dataConsulta} onChangeText={handleDataMask} placeholder="DD/MM/AAAA" keyboardType="numeric" maxLength={10} placeholderTextColor="#999" />

        <Text style={styles.label}>Horário</Text>
        <TextInput style={styles.input} value={horaConsulta} onChangeText={handleHoraMask} placeholder="HH:MM" keyboardType="numeric" maxLength={5} placeholderTextColor="#999" />

        <Text style={styles.label}>Motivo / Sintomas</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={motivo} onChangeText={setMotivo} placeholder="Descreva os sintomas..." multiline placeholderTextColor="#999" />

        <TouchableOpacity style={styles.button} onPress={handleSchedule}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClear} onPress={handleClear}>
          <Text style={styles.buttonClearText}>Limpar Campos</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, { marginTop: 30, fontSize: 24 }]}>Próximas Consultas</Text>

      {appointments.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma consulta agendada.</Text>
      ) : (
        appointments.map((app) => (
          <View key={app.id} style={styles.appointmentCard}>
            <View style={styles.appInfo}>
              <Text style={styles.appTitle}>Consulta: {app.petName}</Text>
              <Text style={styles.appDetail}>Data: <Text style={styles.bold}>{app.dataConsulta}</Text> às <Text style={styles.bold}>{app.horaConsulta}</Text></Text>
              <Text style={styles.appDetail}>Motivo: {app.motivo}</Text>
            </View>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => handleCancelAppointment(app.id, app.petName)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
  buttonClearText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10 },
  appointmentCard: { 
    backgroundColor: theme.colors.white, 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderLeftWidth: 5, 
    borderLeftColor: theme.colors.primary, 
    elevation: 2
  },
  appInfo: { marginBottom: 10 },
  appTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 5 },
  appDetail: { fontSize: 14, color: '#444', marginBottom: 3 },
  bold: { fontWeight: 'bold', color: theme.colors.secondary },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  cancelButtonText: { color: '#FFF', fontWeight: 'bold' }
});