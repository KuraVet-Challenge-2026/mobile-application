import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme/types';
import { obterInfoApp } from '../utils/infoApp';

const logoSource = require('../../assets/logo.png');

const INTEGRANTES = [
  { nome: 'Guilherme', rm: 'RM562396' },
  { nome: 'Pedro', rm: 'RM563405' },
  { nome: 'Henrique', rm: 'RM563620' },
];

export default function SobreAppScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);
  const info = useMemo(() => obterInfoApp(), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cabecalho}>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <Text style={styles.nomeApp}>{info.nome}</Text>
          <Text style={styles.versaoApp}>Versão {info.versao}</Text>
        </View>

        <Text style={styles.descricao}>
          O KuraVet conecta tutores e veterinários para acompanhar a saúde dos pets, com triagem
          de sintomas, agendamento de consultas e teleconsulta em um só app.
        </Text>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Versão publicada</Text>

          <Text style={styles.rotulo}>Hash do commit</Text>
          <Text style={styles.hashCompleto} selectable>
            {info.commitHash}
          </Text>
          <Text style={styles.hashCurto} selectable>
            ({info.commitCurto})
          </Text>

          <View style={styles.divisor} />

          <Text style={styles.rotulo}>Perfil do build</Text>
          <Text style={styles.valor}>{info.perfilBuild}</Text>

          <Text style={styles.rotulo}>Servidor da API</Text>
          <Text style={styles.valor}>{info.servidorApi}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Equipe 2TDSPO</Text>
          {INTEGRANTES.map((integrante) => (
            <View key={integrante.rm} style={styles.integranteLinha}>
              <Text style={styles.integranteNome}>{integrante.nome}</Text>
              <Text style={styles.integranteRm}>{integrante.rm}</Text>
            </View>
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
    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },
    cabecalho: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      width: 72,
      height: 72,
      marginBottom: 12,
    },
    nomeApp: {
      fontSize: 22,
      fontWeight: '800',
      color: c.title,
    },
    versaoApp: {
      fontSize: 14,
      color: c.textSecondary,
      marginTop: 2,
    },
    descricao: {
      fontSize: 14,
      color: c.text,
      lineHeight: 20,
      marginBottom: 24,
      textAlign: 'center',
    },
    card: {
      backgroundColor: c.card,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    tituloCard: {
      fontSize: 14,
      fontWeight: '700',
      color: c.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    rotulo: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textSecondary,
      marginTop: 10,
      textTransform: 'uppercase',
    },
    valor: {
      fontSize: 16,
      fontWeight: '700',
      color: c.title,
      marginTop: 2,
    },
    hashCompleto: {
      fontSize: 13,
      fontFamily: 'monospace',
      color: c.title,
      marginTop: 4,
    },
    hashCurto: {
      fontSize: 12,
      fontFamily: 'monospace',
      color: c.textMuted,
      marginTop: 2,
    },
    divisor: {
      height: 1,
      backgroundColor: c.border,
      marginTop: 14,
      marginBottom: 2,
    },
    integranteLinha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    integranteNome: {
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
    },
    integranteRm: {
      fontSize: 13,
      color: c.textSecondary,
    },
  });
}
