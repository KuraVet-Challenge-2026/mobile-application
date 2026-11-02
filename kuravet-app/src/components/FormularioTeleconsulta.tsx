import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import { usePets } from '../hooks/usePets';
import { useVeterinarios } from '../hooks/useVeterinarios';
import { useSolicitarTeleconsulta } from '../hooks/useConsultas';
import {
  TIPO_CONSULTA_MAX_LENGTH,
  proximasDatasConsulta,
  validarDataConsultaFutura,
  validarTipoConsulta,
} from '../services/consultaRegras';
import { formatarData } from '../utils/formatarData';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import Chip from './Chip';
import VeterinarioCard from './VeterinarioCard';

interface FormularioTeleconsultaProps {
  idPetInicial?: number;
  prioritaria?: boolean;
}

export default function FormularioTeleconsulta({
  idPetInicial,
  prioritaria = false,
}: FormularioTeleconsultaProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const { data: pets } = usePets();
  const {
    data: veterinarios,
    isLoading: isLoadingVets,
    isError: isErrorVets,
    error: errorVets,
  } = useVeterinarios();
  const solicitar = useSolicitarTeleconsulta();

  const datasDisponiveis = useMemo(() => proximasDatasConsulta(7), []);

  const [idPetSelecionado, setIdPetSelecionado] = useState<number | undefined>(idPetInicial);
  const [idVeterinarioSelecionado, setIdVeterinarioSelecionado] = useState<number | undefined>(
    undefined
  );
  const [dataSelecionada, setDataSelecionada] = useState<string | undefined>(undefined);
  const [tipoConsulta, setTipoConsulta] = useState(
    prioritaria ? 'Triagem prioritária' : 'Teleconsulta'
  );

  const petSelecionado = pets?.find((pet) => pet.idPet === idPetSelecionado);

  const podeSolicitar =
    idPetSelecionado !== undefined &&
    idVeterinarioSelecionado !== undefined &&
    !!dataSelecionada &&
    validarDataConsultaFutura(dataSelecionada) &&
    validarTipoConsulta(tipoConsulta) &&
    !solicitar.isPending;

  function handleSolicitar() {
    if (
      idPetSelecionado === undefined ||
      idVeterinarioSelecionado === undefined ||
      !dataSelecionada ||
      !podeSolicitar
    ) {
      return;
    }

    solicitar.mutate(
      {
        idPet: idPetSelecionado,
        idVeterinario: idVeterinarioSelecionado,
        dataConsulta: dataSelecionada,
        tipoConsulta: tipoConsulta.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert('Solicitação enviada', 'Sua solicitação de teleconsulta foi enviada.');
          setIdVeterinarioSelecionado(undefined);
          setDataSelecionada(undefined);
        },
        onError: (erro) => {
          Alert.alert(
            'Não foi possível solicitar',
            getApiErrorMessage(erro, 'Não foi possível enviar a solicitação agora. Tente novamente.')
          );
        },
      }
    );
  }

  return (
    <View>
      <Text style={styles.titulo}>Solicitar teleconsulta</Text>

      {prioritaria && (
        <View style={styles.banner}>
          <Text style={styles.bannerTexto}>
            A triagem recomendou atendimento prioritário para {petSelecionado?.nome ?? 'o pet'}.
          </Text>
        </View>
      )}

      <Text style={styles.label}>Pet</Text>
      <View style={styles.chipsRow}>
        {(pets ?? []).map((pet) => (
          <Chip
            key={pet.idPet}
            texto={pet.nome}
            selecionado={pet.idPet === idPetSelecionado}
            onPress={() => setIdPetSelecionado(pet.idPet)}
          />
        ))}
      </View>

      <Text style={styles.label}>Veterinário</Text>
      {isLoadingVets ? (
        <ActivityIndicator color={colors.primary} />
      ) : isErrorVets ? (
        <Text style={styles.errorText}>
          {getApiErrorMessage(errorVets, 'Não foi possível carregar os veterinários agora.')}
        </Text>
      ) : !veterinarios || veterinarios.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum veterinário cadastrado na clínica ainda.</Text>
      ) : (
        veterinarios.map((veterinario) => (
          <VeterinarioCard
            key={veterinario.idVeterinario}
            veterinario={veterinario}
            selecionado={veterinario.idVeterinario === idVeterinarioSelecionado}
            onPress={() => setIdVeterinarioSelecionado(veterinario.idVeterinario)}
          />
        ))
      )}

      <Text style={styles.label}>Data</Text>
      <View style={styles.chipsRow}>
        {datasDisponiveis.map((data) => (
          <Chip
            key={data}
            texto={formatarData(data)}
            selecionado={data === dataSelecionada}
            onPress={() => setDataSelecionada(data)}
          />
        ))}
      </View>

      <Text style={styles.label}>Tipo da consulta</Text>
      <TextInput
        style={styles.input}
        value={tipoConsulta}
        onChangeText={setTipoConsulta}
        placeholder="Ex.: Teleconsulta"
        placeholderTextColor={colors.textMuted}
        maxLength={TIPO_CONSULTA_MAX_LENGTH}
      />

      <TouchableOpacity
        style={[styles.button, !podeSolicitar && styles.buttonDisabled]}
        activeOpacity={0.8}
        onPress={handleSolicitar}
        disabled={!podeSolicitar}
      >
        {solicitar.isPending ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>SOLICITAR</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    titulo: { fontSize: 20, fontWeight: '800', color: c.title, marginBottom: 4 },

    banner: {
      backgroundColor: c.errorBackground,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.errorBorder,
      padding: 14,
      marginTop: 12,
    },
    bannerTexto: {
      fontSize: 13,
      color: c.error,
      lineHeight: 19,
    },

    label: { fontSize: 13, fontWeight: '700', color: c.text, marginBottom: 10, marginTop: 16 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },

    errorText: { color: c.error, fontSize: 14, lineHeight: 20 },
    emptyText: { color: c.textSecondary, fontSize: 14, lineHeight: 20 },

    input: {
      backgroundColor: c.card,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: c.text,
    },

    button: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { fontSize: 15, fontWeight: '800', color: c.text, letterSpacing: 0.3 },
  });
}
