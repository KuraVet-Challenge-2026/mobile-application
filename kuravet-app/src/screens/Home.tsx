import React, { useMemo } from 'react';
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
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';
import { formatarData } from '../utils/formatarData';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type RotaSemParametro = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K] ? K : never;
}[keyof RootStackParamList];

const QUICK_ACTIONS: {
  key: string;
  label: string;
  icon?: string;
  image?: any;
  route: RotaSemParametro;
}[] = [
    {
      key: 'triagem',
      label: 'Triagem IA',
      image: require('../../assets/Animais.jpg'),
      route: 'Triagem'
    },
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

type EstilosHome = ReturnType<typeof criarEstilos>;

function StatusBadge({
  status,
  colors,
  styles,
}: {
  status: Consulta['status'];
  colors: PaletaCores;
  styles: EstilosHome;
}) {
  const cor = colors.statusConsulta[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: cor.background }]}>
      <Text style={[styles.statusBadgeText, { color: cor.texto }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

function ConsultaCard({
  consulta,
  colors,
  styles,
}: {
  consulta: Consulta;
  colors: PaletaCores;
  styles: EstilosHome;
}) {
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
        <Text style={styles.consultaData}>{formatarData(consulta.dataConsulta)}</Text>
      </View>

      <StatusBadge status={consulta.status} colors={colors} styles={styles} />
    </View>
  );
}

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

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
              <ActivityIndicator color={colors.primary} size="large" />
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
              <ConsultaCard key={consulta.idConsulta} consulta={consulta} colors={colors} styles={styles} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
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
      backgroundColor: c.card,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    greeting: {
      fontSize: 20,
      fontWeight: '800',
      color: c.title,
    },
    greetingSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: c.textSecondary,
    },
    avatarPlaceholder: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.primary,
      borderWidth: 2,
      borderColor: c.card,
    },

    // ---- Sessões genéricas ----
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.title,
      marginBottom: 14,
    },

    // ---- Ações rápidas ----
    quickActionsRow: {
      paddingRight: 8,
      gap: 12,
    },
    quickActionCard: {
      width: 104,
      backgroundColor: c.card,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 10,
      alignItems: 'center',
      marginRight: 12,
      shadowColor: c.title,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
    },
    quickActionIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.primary,
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
      color: c.title,
      textAlign: 'center',
    },

    // ---- Banner de dica ----
    tipBanner: {
      marginHorizontal: 20,
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 20,
      padding: 16,
    },
    tipBannerImagePlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: c.primary,
      marginRight: 14,
      overflow: 'hidden', // Garante que a foto respeite as bordas arredondadas
    },
    tipBannerTextWrap: {
      flex: 1,
    },
    tipBannerTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: c.title,
    },
    tipBannerText: {
      marginTop: 4,
      fontSize: 12.5,
      color: c.textSecondary,
      lineHeight: 18,
    },

    // ---- Feed de consultas ----
    loadingBox: {
      paddingVertical: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorBox: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
    },
    errorText: {
      color: c.error,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyBox: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
    },
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    consultaCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
    },
    consultaThumb: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: c.primary,
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
      color: c.title,
      flexShrink: 1,
    },
    consultaDetail: {
      marginTop: 3,
      fontSize: 13,
      color: c.textAccent,
    },
    consultaData: {
      marginTop: 3,
      fontSize: 12,
      color: c.textSecondary,
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
}