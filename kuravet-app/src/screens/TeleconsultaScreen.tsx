import React, { useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import type { RootStackParamList } from '../routes';
import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import { useCancelarConsulta, useConsultas } from '../hooks/useConsultas';
import { podeCancelar } from '../services/consultaRegras';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import FormularioTeleconsulta from '../components/FormularioTeleconsulta';
import SolicitacaoConsultaCard from '../components/SolicitacaoConsultaCard';

type TeleconsultaRouteProp = RouteProp<RootStackParamList, 'Teleconsulta'>;

export default function TeleconsultaScreen() {
  const route = useRoute<TeleconsultaRouteProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const { data: consultas } = useConsultas();
  const cancelar = useCancelarConsulta();

  const idConsultaCancelando = cancelar.isPending ? cancelar.variables : undefined;
  const solicitacoes = useMemo(() => (consultas ?? []).filter(podeCancelar), [consultas]);

  function handleCancelar(idConsulta: number, nomePet: string) {
    Alert.alert('Cancelar consulta', `Deseja cancelar a consulta de ${nomePet}?`, [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Cancelar',
        style: 'destructive',
        onPress: () => {
          cancelar.mutate(idConsulta, {
            onError: (erro) => {
              Alert.alert(
                'Não foi possível cancelar',
                getApiErrorMessage(erro, 'Não foi possível cancelar a consulta agora. Tente novamente.')
              );
            },
          });
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormularioTeleconsulta
            idPetInicial={route.params?.idPet}
            prioritaria={route.params?.prioritaria}
          />

          <Text style={styles.titulo}>Minhas solicitações</Text>
          {solicitacoes.length === 0 ? (
            <Text style={styles.emptyText}>Você não tem solicitações em aberto.</Text>
          ) : (
            solicitacoes.map((consulta) => (
              <SolicitacaoConsultaCard
                key={consulta.idConsulta}
                consulta={consulta}
                isCancelando={idConsultaCancelando === consulta.idConsulta}
                onCancelar={() => handleCancelar(consulta.idConsulta, consulta.nomePet)}
              />
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 32 },

    titulo: { fontSize: 20, fontWeight: '800', color: c.title, marginTop: 24, marginBottom: 12 },
    emptyText: { color: c.textSecondary, fontSize: 14, lineHeight: 20 },
  });
}
