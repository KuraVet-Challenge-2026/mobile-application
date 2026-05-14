import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/colors';

export default function HealthGuideScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Testes Físicos Rápidos</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Frequência Respiratória</Text>
        <Text style={styles.text}>Conte as inspirações por 60s:</Text>
        <Text style={styles.bullet}>• Cães: 18-36 | Gatos: 20-40</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. TPC (Gengiva)</Text>
        <Text style={styles.text}>Pressione a gengiva. Deve voltar ao normal em 1 a 2 segundos.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Mucosas</Text>
        <Text style={styles.bullet}>• Rosada: Normal</Text>
        <Text style={styles.bullet}>• Pálida: Anemia</Text>
        <Text style={styles.bullet}>• Amarelada: Fígado</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Hidratação</Text>
        <Text style={styles.text}>Puxe a pele: se voltar na hora, está hidratado.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: theme.colors.white, padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: theme.colors.secondary },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 5 },
  text: { fontSize: 15, color: '#333' },
  bullet: { fontSize: 15, color: '#555', marginLeft: 10 }
});