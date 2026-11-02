import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import type { Consulta } from '../types';
import { podeCancelar } from '../services/consultaRegras';
import { formatarData } from '../utils/formatarData';
import StatusConsultaBadge from './StatusConsultaBadge';

interface SolicitacaoConsultaCardProps {
  consulta: Consulta;
  isCancelando: boolean;
  onCancelar: () => void;
}

export default function SolicitacaoConsultaCard({
  consulta,
  isCancelando,
  onCancelar,
}: SolicitacaoConsultaCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.nomePet} numberOfLines={1}>
            {consulta.nomePet}
          </Text>
          <Text style={styles.detalhe} numberOfLines={1}>
            {consulta.nomeVeterinario}
          </Text>
          <Text style={styles.detalhe}>
            {consulta.tipoConsulta} · {formatarData(consulta.dataConsulta)}
          </Text>
        </View>
        <StatusConsultaBadge status={consulta.status} />
      </View>

      {podeCancelar(consulta) && (
        <TouchableOpacity
          style={[styles.botaoCancelar, isCancelando && styles.botaoDesabilitado]}
          activeOpacity={0.8}
          onPress={onCancelar}
          disabled={isCancelando}
        >
          {isCancelando ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <Text style={styles.textoCancelar}>CANCELAR</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    info: {
      flex: 1,
      marginRight: 12,
    },
    nomePet: {
      fontSize: 15,
      fontWeight: '700',
      color: c.title,
    },
    detalhe: {
      marginTop: 3,
      fontSize: 13,
      color: c.textSecondary,
    },
    botaoCancelar: {
      marginTop: 12,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.errorBackground,
      borderWidth: 1,
      borderColor: c.errorBorder,
    },
    botaoDesabilitado: {
      opacity: 0.7,
    },
    textoCancelar: {
      fontSize: 13,
      fontWeight: '800',
      color: c.error,
      letterSpacing: 0.3,
    },
  });
}
