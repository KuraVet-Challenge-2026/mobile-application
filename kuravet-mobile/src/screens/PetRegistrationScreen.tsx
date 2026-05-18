import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';

export default function PetRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [peso, setPeso] = useState('');

  
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    async function loadPets() {
      const storedPets = await AsyncStorage.getItem('@KuraVet:pets');
      if (storedPets) {
        setPets(JSON.parse(storedPets));
      }
    }
    loadPets();
  }, []);

 
  const handleDataMask = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDataNasc(formatted);
  };

  
  const handlePesoMask = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned === '') {
      setPeso('');
      return;
    }
    const num = (parseFloat(cleaned) / 10).toFixed(1);
    setPeso(`${num} kg`);
  };

  const handleRegister = async () => {
    if (!nome || !especie || !dataNasc || !peso) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos do formulário.');
      return;
    }

    
    const newPet = {
      id: String(Date.now()), 
      nome,
      especie,
      dataNasc,
      peso
    };

   
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);

    
    await AsyncStorage.setItem('@KuraVet:pets', JSON.stringify(updatedPets));

    Alert.alert('Sucesso', `${nome} foi cadastrado com sucesso!`);
    
  
    setNome(''); setEspecie(''); setDataNasc(''); setPeso('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Gestão de Pets</Text>
    
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Thor" placeholderTextColor="#999" />

        <Text style={styles.label}>Espécie</Text>
        <TextInput style={styles.input} value={especie} onChangeText={setEspecie} placeholder="Ex: Cachorro" placeholderTextColor="#999" />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput style={styles.input} value={dataNasc} onChangeText={handleDataMask} placeholder="DD/MM/AAAA" placeholderTextColor="#999" keyboardType="numeric" maxLength={10} />

        <Text style={styles.label}>Peso</Text>
        <TextInput style={styles.input} value={peso} onChangeText={handlePesoMask} placeholder="0.0 kg" placeholderTextColor="#999" keyboardType="numeric" />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar Pet</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, { marginTop: 30, fontSize: 24 }]}>Meus Pets</Text>

      {pets.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>
      ) : (
        pets.map((pet) => (
          <View key={pet.id} style={styles.petCard}>
            <Text style={styles.petName}>{pet.nome}</Text>
            <Text style={styles.petDetail}>Espécie: <Text style={styles.bold}>{pet.especie}</Text></Text>
            <Text style={styles.petDetail}>Nascimento: <Text style={styles.bold}>{pet.dataNasc}</Text></Text>
            <Text style={styles.petDetail}>Peso: <Text style={styles.bold}>{pet.peso}</Text></Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginVertical: 15 },
  card: { backgroundColor: theme.colors.white, padding: 20, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  label: { color: theme.colors.primary, fontWeight: 'bold', marginBottom: 8, fontSize: 15 },
  input: { borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 8, padding: 12, marginBottom: 20, color: theme.colors.primary, backgroundColor: '#FFF' },
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 16 },

  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10 },
  petCard: { backgroundColor: theme.colors.white, padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: theme.colors.secondary, elevation: 2 },
  petName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 5 },
  petDetail: { fontSize: 15, color: '#444', marginBottom: 3 },
  bold: { fontWeight: 'bold', color: theme.colors.primary }
});