import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import api from '../services/api';

const backgroundImg = require('../../assets/background.jpg');
const logoImg = require('../../assets/logo.png');

// GET /api/pets — baseURL do axios (src/services/api.js) já termina em "/api".
async function fetchPets() {
  const { data } = await api.get('/pets');
  return data;
}

export default function Home() {
  const navigation = useNavigation();

  const {
    data: pets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pets'],
    queryFn: fetchPets,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero: ilustração já traz o degradê claro -> azul base do Figma */}
        <ImageBackground source={backgroundImg} style={styles.hero} resizeMode="cover">
          <View style={styles.header}>
            <Image source={logoImg} style={styles.logo} resizeMode="contain" />
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Perfil')}
            >
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>
              Atendimento <Text style={styles.titleAccent}>online</Text>
              {'\n'}em minutos.
            </Text>
            <Text style={styles.subtitle}>O jeito mais fácil de falar com veterinários</Text>
          </View>

          <View style={styles.heroSpacer} />

          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Teleconsulta')}
          >
            <Text style={styles.ctaButtonText}>AGENDE</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Conteúdo: fundo na cor predominante do Figma */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Descubra os melhores veterinários em poucos cliques</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Agende rápido e receba atendimento imediato</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Vets qualificados, dados 100% protegidos</Text>
          </View>

          <Text style={styles.sectionTitle}>Pets cadastrados</Text>

          {isLoading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#F2994A" />
            </View>
          )}

          {!isLoading && isError && (
            <Text style={styles.errorText}>
              Não foi possível carregar os dados da API. Verifique sua conexão e tente novamente.
            </Text>
          )}

          {!isLoading && !isError && (!pets || pets.length === 0) && (
            <Text style={styles.emptyText}>Nenhum pet cadastrado até o momento.</Text>
          )}

          {!isLoading &&
            !isError &&
            pets?.map((pet, index) => (
              <View key={pet?.id ?? index} style={styles.petCard}>
                <View style={styles.petAvatar}>
                  <Text style={styles.petAvatarText}>
                    {pet?.nome ? pet.nome.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet?.nome ?? 'Pet sem nome'}</Text>
                  <Text style={styles.petSpecies}>
                    {pet?.especie ?? pet?.raca ?? 'Espécie não informada'}
                  </Text>
                </View>
              </View>
            ))}

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HistoricoDiagnostico')}
          >
            <Text style={styles.secondaryButtonText}>Ver Histórico</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDEBF7',
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ---- Hero (imagem de fundo com o filhote + celular) ----
  hero: {
    width: '100%',
    minHeight: 540,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 34,
  },
  menuButton: {
    width: 28,
    height: 20,
    justifyContent: 'space-between',
  },
  menuBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2D6FA3',
  },
  titleWrap: {
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E4E79',
    lineHeight: 32,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#F2994A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#4C7EA8',
    textAlign: 'center',
  },
  heroSpacer: {
    flex: 1,
  },
  ctaButton: {
    alignSelf: 'center',
    backgroundColor: '#F2994A',
    paddingVertical: 14,
    paddingHorizontal: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#F2F7FC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ---- Conteúdo ----
  content: {
    flex: 1,
    backgroundColor: '#DDEBF7',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#F2F7FC',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#1E4E79',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#2D6FA3',
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E4E79',
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#B3261E',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    color: '#4C7EA8',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C9DEF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  petAvatarText: {
    color: '#1E4E79',
    fontSize: 18,
    fontWeight: '700',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E4E79',
  },
  petSpecies: {
    marginTop: 2,
    fontSize: 13,
    color: '#4C7EA8',
  },
  secondaryButton: {
    marginTop: 12,
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: '#C9DEF2',
    backgroundColor: '#F2F7FC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: '#2D6FA3',
    fontSize: 14,
    fontWeight: '700',
  },
});
