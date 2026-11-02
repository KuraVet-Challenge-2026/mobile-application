import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { TriagemResponse } from '../types';
import { AVISO_TRIAGEM, descreverAnalise, precisaExibirAviso } from '../services/triagemRegras';
import { formatarDataHora } from '../utils/formatarData';
import UrgenciaBadge from './UrgenciaBadge';
import BotaoTeleconsultaPrioritaria from './BotaoTeleconsultaPrioritaria';

interface ResultadoTriagemProps {
  triagem: TriagemResponse;
}

export default function ResultadoTriagem({ triagem }: ResultadoTriagemProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);
  const analise = descreverAnalise(triagem);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.nomePet} numberOfLines={1}>
            {triagem.nomePet}
          </Text>
          <Text style={styles.data}>{formatarDataHora(triagem.dataTriagem)}</Text>
        </View>
        <UrgenciaBadge urgencia={triagem.urgencia} />
      </View>

      <Text style={styles.label}>Recomendação</Text>
      <Text style={styles.texto}>{triagem.recomendacao}</Text>

      {!!triagem.orientacao && (
        <>
          <Text style={styles.label}>Orientação</Text>
          <Text style={styles.texto}>{triagem.orientacao}</Text>
        </>
      )}

      <Text style={styles.label}>Sintomas identificados</Text>
      {triagem.sintomas.length > 0 ? (
        <View style={styles.sintomasLista}>
          {triagem.sintomas.map((sintoma, indice) => (
            <View key={`${sintoma}-${indice}`} style={styles.sintomaChip}>
              <Text style={styles.sintomaTexto}>{sintoma}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.texto}>Nenhum sintoma identificado</Text>
      )}

      <Text style={styles.selo}>{analise.selo}</Text>

      {precisaExibirAviso(triagem.orientacao) && <Text style={styles.aviso}>{AVISO_TRIAGEM}</Text>}

      {triagem.sugereTeleconsultaPrioritaria && (
        <BotaoTeleconsultaPrioritaria idPet={triagem.idPet} />
      )}
    </View>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerInfo: {
      flex: 1,
      marginRight: 12,
    },
    nomePet: {
      fontSize: 18,
      fontWeight: '800',
      color: c.title,
    },
    data: {
      marginTop: 2,
      fontSize: 12,
      color: c.textMuted,
    },

    label: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textSecondary,
      marginTop: 14,
      marginBottom: 6,
    },
    texto: {
      fontSize: 14,
      color: c.text,
      lineHeight: 20,
    },

    sintomasLista: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    sintomaChip: {
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    sintomaTexto: {
      fontSize: 12.5,
      color: c.text,
    },

    selo: {
      marginTop: 18,
      alignSelf: 'flex-start',
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },

    aviso: {
      marginTop: 14,
      fontSize: 12,
      fontStyle: 'italic',
      color: c.textMuted,
      lineHeight: 18,
    },
  });
}
