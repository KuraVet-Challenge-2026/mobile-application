import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BotaoTeleconsultaPrioritariaProps {
  idPet: number;
}

export default function BotaoTeleconsultaPrioritaria({
  idPet,
}: BotaoTeleconsultaPrioritariaProps) {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.botao}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Teleconsulta', { idPet, prioritaria: true })}
    >
      <Text style={styles.texto}>SOLICITAR TELECONSULTA PRIORITÁRIA</Text>
    </TouchableOpacity>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    botao: {
      backgroundColor: c.errorBackground,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      borderWidth: 1,
      borderColor: c.errorBorder,
    },
    texto: {
      fontSize: 14,
      fontWeight: '800',
      color: c.error,
      letterSpacing: 0.3,
      textAlign: 'center',
    },
  });
}
