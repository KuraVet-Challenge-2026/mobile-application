import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import api from '../services/api';

// GET /consultas — baseURL do axios (src/services/api.js) já termina em "/api".
async function fetchConsultas() {
  const { data } = await api.get('/consultas');
  return data;
}

// Dados genéricos exibidos apenas para o layout não quebrar caso a API
// responda com sucesso mas sem nenhum registro ainda cadastrado.
const CONSULTAS_FALLBACK = [
  {
    id: 'fallback-1',
    petNome: 'Thor',
    tutorNome: 'Ana Souza',
    veterinario: 'Dra. Camila Reis',
    data: 'Hoje às 15:30',
    status: 'Agendada',
  },
  {
    id: 'fallback-2',
    petNome: 'Mel',
    tutorNome: 'Bruno Lima',
    veterinario: 'Dr. Felipe Nogueira',
    data: 'Amanhã às 09:00',
    status: 'Confirmada',
  },
  {
    id: 'fallback-3',
    petNome: 'Nina',
    tutorNome: 'Carla Dias',
    veterinario: 'Dra. Camila Reis',
    data: '21/08 às 11:15',
    status: 'Agendada',
  },
];

const QUICK_ACTIONS = [
  { key: 'consulta', label: 'Nova Consulta', icon: '🩺', route: 'Teleconsulta' },
  { key: 'pets', label: 'Meus Pets', icon: '🐾', route: 'CadastroPet' },
  { key: 'historico', label: 'Histórico', icon: '📋', route: 'HistoricoDiagnostico' },
];

const STATUS_STYLES = {
  Agendada: { backgroundColor: '#C9DEF2', color: '#1E4E79' },
  Confirmada: { backgroundColor: '#9FC6EA', color: '#12385C' },
  Concluída: { backgroundColor: '#DDEBF7', color: '#2D6FA3' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Agendada;
  return (
    <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.statusBadgeText, { color: style.color }]}>{status ?? 'Agendada'}</Text>
    </View>
  );
}

function ConsultaCard({ consulta, isFallback }) {
  return (
    <View style={styles.consultaCard}>
      {/* Placeholder: futuramente receberá a foto real do pet/tutor */}
      <View style={styles.consultaThumb} />

      <View style={styles.consultaInfo}>
        <View style={styles.consultaInfoHeader}>
          <Text style={styles.consultaPetNome} numberOfLines={1}>
            {consulta?.petNome ?? consulta?.pet?.nome ?? 'Pet sem nome'}
          </Text>
          {isFallback && (
            <View style={styles.previewTag}>
              <Text style={styles.previewTagText}>Exemplo</Text>
            </View>
          )}
        </View>
        <Text style={styles.consultaDetail} numberOfLines={1}>
          {consulta?.veterinario ?? consulta?.medico ?? 'Veterinário a definir'}
        </Text>
        <Text style={styles.consultaData}>{consulta?.data ?? consulta?.dataHora ?? 'Data a definir'}</Text>
      </View>

      <StatusBadge status={consulta?.status} />
    </View>
  );
}

export default function Home() {
  const navigation = useNavigation();

  const {
    data: consultas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['consultas'],
    queryFn: fetchConsultas,
  });

  const temDadosReais = !isLoading && !isError && Array.isArray(consultas) && consultas.length > 0;
  const listaExibida = temDadosReais ? consultas : CONSULTAS_FALLBACK;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header: saudação + placeholder de foto de perfil */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, tudo bem? 👋</Text>
            <Text style={styles.greetingSubtitle}>Vamos cuidar do seu pet hoje?</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarPlaceholder}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Perfil')}
          />
        </View>

        {/* Ações rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(action.route)}
              >
                <View style={styles.quickActionIconWrap}>
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Banner de destaque: espaço reservado para uma futura ilustração/imagem */}
        <View style={styles.tipBanner}>
          <View style={styles.tipBannerImagePlaceholder} />
          <View style={styles.tipBannerTextWrap}>
            <Text style={styles.tipBannerTitle}>Dica de saúde</Text>
            <Text style={styles.tipBannerText}>
              Mantenha as vacinas e vermífugos do seu pet sempre em dia.
            </Text>
          </View>
        </View>

        {/* Sessão principal: feed de próximas consultas vindo da API */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Consultas</Text>

          {isLoading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#C9DEF2" size="large" />
            </View>
          )}

          {!isLoading && isError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                Não foi possível carregar suas consultas agora. Verifique sua conexão e tente
                novamente em instantes.
              </Text>
            </View>
          )}

          {!isLoading &&
            !isError &&
            listaExibida.map((consulta, index) => (
              <ConsultaCard
                key={consulta?.id ?? index}
                consulta={consulta}
                isFallback={!temDadosReais}
              />
            ))}
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
    paddingBottom: 32,
  },

  // ---- Header ----
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F7FC',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E4E79',
  },
  greetingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#4C7EA8',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#C9DEF2',
    borderWidth: 2,
    borderColor: '#F2F7FC',
  },

  // ---- Sessões genéricas ----
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E4E79',
    marginBottom: 14,
  },

  // ---- Ações rápidas ----
  quickActionsRow: {
    paddingRight: 8,
    gap: 12,
  },
  quickActionCard: {
    width: 104,
    backgroundColor: '#F2F7FC',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#1E4E79',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C9DEF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionIcon: {
    fontSize: 22,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E4E79',
    textAlign: 'center',
  },

  // ---- Banner de dica ----
  tipBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FC',
    borderRadius: 20,
    padding: 16,
  },
  tipBannerImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#C9DEF2',
    marginRight: 14,
  },
  tipBannerTextWrap: {
    flex: 1,
  },
  tipBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E4E79',
  },
  tipBannerText: {
    marginTop: 4,
    fontSize: 12.5,
    color: '#4C7EA8',
    lineHeight: 18,
  },

  // ---- Feed de consultas ----
  loadingBox: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    backgroundColor: '#F2F7FC',
    borderRadius: 16,
    padding: 16,
  },
  errorText: {
    color: '#B3261E',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  consultaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  consultaThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#C9DEF2',
    marginRight: 12,
  },
  consultaInfo: {
    flex: 1,
    marginRight: 10,
  },
  consultaInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consultaPetNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E4E79',
    flexShrink: 1,
  },
  previewTag: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#DDEBF7',
  },
  previewTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4C7EA8',
  },
  consultaDetail: {
    marginTop: 3,
    fontSize: 13,
    color: '#2D6FA3',
  },
  consultaData: {
    marginTop: 3,
    fontSize: 12,
    color: '#4C7EA8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
