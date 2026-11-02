import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import type { PaletaCores } from '../theme';
import { useAppTheme } from '../theme';
import { useTriagem } from '../hooks/useTriagens';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import ResultadoTriagem from '../components/ResultadoTriagem';

type TriagemDetalheNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TriagemDetalhe'>;
type TriagemDetalheRouteProp = RouteProp<RootStackParamList, 'TriagemDetalhe'>;

export default function TriagemDetalheScreen() {
  const navigation = useNavigation<TriagemDetalheNavigationProp>();
  const { params } = useRoute<TriagemDetalheRouteProp>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const { data: triagem, isLoading, isError, error } = useTriagem(params.idTriagem);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !triagem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.messageBox}>
          <Text style={styles.errorText}>
            {getApiErrorMessage(
              error,
              'Não foi possível carregar esta triagem agora. Verifique sua conexão e tente novamente.'
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ResultadoTriagem triagem={triagem} />

        <TouchableOpacity
          style={styles.buttonSecundario}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Triagem', { idPet: triagem.idPet })}
        >
          <Text style={styles.buttonSecundarioText}>REFAZER TRIAGEM</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function criarEstilos(c: PaletaCores) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.background },
    scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 32 },
    centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    messageBox: {
      margin: 20,
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    errorText: { color: c.error, fontSize: 14, textAlign: 'center', lineHeight: 20 },

    buttonSecundario: {
      backgroundColor: c.card,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      borderWidth: 1.5,
      borderColor: c.primary,
    },
    buttonSecundarioText: { fontSize: 15, fontWeight: '800', color: c.title, letterSpacing: 0.3 },
  });
}
