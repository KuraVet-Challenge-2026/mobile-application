import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { Consulta } from '../types';
import { useConsultas } from '../hooks/useConsultas';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type RotaSemParametro = {
  [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined ? K : never;
}[keyof RootStackParamList];

const QUICK_ACTIONS: {
  key: string;
  label: string;
  icon?: string;
  image?: any;
  route: RotaSemParametro;
}[] = [
    {
      key: 'consulta',
      label: 'Nova Consulta',
      image: require('../../assets/Medica.jpg'),
      route: 'Teleconsulta'
    },
    {
      key: 'pets',
      label: 'Meus Pets',
      image: require('../../assets/Cachorro Caramelho.jpg'),
      route: 'PetsList'
    },
    {
      key: 'historico',
      label: 'Histórico',
      image: require('../../assets/Calendario.jpg'),
      route: 'HistoricoDiagnostico'
    },
  ];

const STATUS_LABELS: Record<Consulta['status'], string> = {
  SOLICITADA: 'Solicitada',
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
  RECUSADA: 'Recusada',
};

const STATUS_STYLES: Record<Consulta['status'], { backgroundColor: string; color: string }> = {
  SOLICITADA: { backgroundColor: '#DDEBF7', color: '#2D6FA3' },
  AGENDADA: { backgroundColor: '#C9DEF2', color: '#1E4E79' },
  REALIZADA: { backgroundColor: '#9FC6EA', color: '#12385C' },
  CANCELADA: { backgroundColor: '#F9DEDC', color: '#B3261E' },
  RECUSADA: { backgroundColor: '#F9DEDC', color: '#B3261E' },
};

function StatusBadge({ status }: { status: Consulta['status'] }) {
  const style = STATUS_STYLES[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.statusBadgeText, { color: style.color }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

function ConsultaCard({ consulta }: { consulta: Consulta }) {
  return (
    <View style={styles.consultaCard}>
      <View style={styles.consultaThumb} />

      <View style={styles.consultaInfo}>
        <View style={styles.consultaInfoHeader}>
          <Text style={styles.consultaPetNome} numberOfLines={1}>
            {consulta.nomePet}
          </Text>
        </View>
        <Text style={styles.consultaDetail} numberOfLines={1}>
          {consulta.nomeVeterinario}
        </Text>
        <Text style={styles.consultaData}>{consulta.dataConsulta}</Text>
      </View>

      <StatusBadge status={consulta.status} />
    </View>
  );
}

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();

  const { data: consultas, isLoading, isError } = useConsultas();

  const listaVazia = !isLoading && !isError && (!consultas || consultas.length === 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, tudo bem?</Text>
            <Text style={styles.greetingSubtitle}>Vamos cuidar do seu pet hoje?</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarPlaceholder}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Perfil')}
          />
        </View>

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
                  {action.image ? (
                    <Image source={action.image} style={styles.quickActionImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  )}
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Banner de destaque com a foto dos pets */}
        <View style={styles.tipBanner}>
          <Image
            source={require('../../assets/Animais.jpg')}
            style={styles.tipBannerImagePlaceholder}
            resizeMode="cover"
          />
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

          {listaVazia && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Você ainda não tem consultas. Toque em &quot;Nova Consulta&quot; para solicitar uma.
              </Text>
            </View>
          )}

          {!isLoading &&
            !isError &&
            consultas?.map((consulta) => (
              <ConsultaCard key={consulta.idConsulta} consulta={consulta} />
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
  quickActionImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    overflow: 'hidden', // Garante que a foto respeite as bordas arredondadas
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
  emptyBox: {
    backgroundColor: '#F2F7FC',
    borderRadius: 16,
    padding: 16,
  },
  emptyText: {
    color: '#4C7EA8',
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