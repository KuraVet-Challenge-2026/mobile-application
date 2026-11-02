import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Chip from '../components/Chip';
import DiagnosticoConsultaCard from '../components/DiagnosticoConsultaCard';
import EmptyState from '../components/EmptyState';
import TriagemHistoricoItem from '../components/TriagemHistoricoItem';
import { useConsultas } from '../hooks/useConsultas';
import { usePets } from '../hooks/usePets';
import { useTriagens } from '../hooks/useTriagens';
import type { RootStackParamList } from '../routes';
import { consultasComDiagnostico } from '../services/consultaRegras';
import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import { getApiErrorMessage } from '../utils/apiErrorMessage';

type HistoricoNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HistoricoDiagnostico'
>;

export default function HistoricoDiagnosticoScreen() {
  const navigation = useNavigation<HistoricoNavigationProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const [idPetFiltro, setIdPetFiltro] = useState<number | null>(null);

  const pets = usePets();
  const consultas = useConsultas();
  const triagens = useTriagens();

  const diagnosticos = useMemo(
    () =>
      consultasComDiagnostico(consultas.data ?? []).filter(
        (consulta) => idPetFiltro === null || consulta.idPet === idPetFiltro
      ),
    [consultas.data, idPetFiltro]
  );

  const triagensFiltradas = useMemo(
    () =>
      (triagens.data ?? [])
        .filter((triagem) => idPetFiltro === null || triagem.idPet === idPetFiltro)
        .sort((a, b) => b.dataTriagem.localeCompare(a.dataTriagem)),
    [triagens.data, idPetFiltro]
  );

  const atualizando =
    (consultas.isFetching && !consultas.isLoading) || (triagens.isFetching && !triagens.isLoading);

  const recarregar = () => {
    consultas.refetch();
    triagens.refetch();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={recarregar} />}
      >
        {pets.data && pets.data.length > 0 ? (
          <View style={styles.filtros}>
            <Chip
              texto="Todos"
              selecionado={idPetFiltro === null}
              onPress={() => setIdPetFiltro(null)}
            />
            {pets.data.map((pet) => (
              <Chip
                key={pet.idPet}
                texto={pet.nome}
                selecionado={idPetFiltro === pet.idPet}
                onPress={() => setIdPetFiltro(pet.idPet)}
              />
            ))}
          </View>
        ) : null}

        <Text style={styles.secaoTitulo}>Diagnósticos de consultas</Text>
        {consultas.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : consultas.isError ? (
          <Text style={styles.errorText}>
            {getApiErrorMessage(consultas.error, 'Não foi possível carregar os diagnósticos agora.')}
          </Text>
        ) : diagnosticos.length === 0 ? (
          <EmptyState compacto mensagem="Nenhum diagnóstico registrado ainda." />
        ) : (
          diagnosticos.map((consulta) => (
            <DiagnosticoConsultaCard key={consulta.idConsulta} consulta={consulta} />
          ))
        )}

        <Text style={styles.secaoTitulo}>Triagens por IA</Text>
        {triagens.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : triagens.isError ? (
          <Text style={styles.errorText}>
            {getApiErrorMessage(triagens.error, 'Não foi possível carregar as triagens agora.')}
          </Text>
        ) : triagensFiltradas.length === 0 ? (
          <EmptyState compacto mensagem="Nenhuma triagem realizada ainda." />
        ) : (
          triagensFiltradas.map((triagem) => (
            <TriagemHistoricoItem
              key={triagem.idTriagem}
              triagem={triagem}
              onPress={() => navigation.navigate('TriagemDetalhe', { idTriagem: triagem.idTriagem })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.background },
    scrollContent: { padding: 20, paddingBottom: 32 },
    filtros: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
    secaoTitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: c.title,
      marginTop: 10,
      marginBottom: 12,
    },
    loading: { marginVertical: 16 },
    errorText: { color: c.error, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  });
}
