import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes';

import { useAuth } from '../auth/AuthContext';
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type PerfilNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

const getInitials = (name?: string | null) => {
  if (!name) return 'US';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function PerfilScreen() {
  const navigation = useNavigation<PerfilNavigationProp>();
  const { usuario, logout } = useAuth();
  const { colors } = useAppTheme();
  const styles = useMemo(() => criarEstilos(colors), [colors]);

  const nomeExibido = usuario?.nomeTutor || usuario?.username || 'Usuário KuraVet';

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja encerrar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch {
              Alert.alert("Erro", "Não foi possível encerrar a sessão.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(nomeExibido)}</Text>
          </View>
          <Text style={styles.userName}>{nomeExibido}</Text>
          <Text style={styles.userEmail}>{usuario?.username ?? ''}</Text>
        </View>

        {/* Menu de Configurações */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.iconFallbackText}>CF</Text>
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuText}>Configurações</Text>
              <Text style={styles.menuSubText}>Dados da conta e preferências</Text>
            </View>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SobreApp')}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.iconFallbackText}>SA</Text>
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuText}>Sobre o App</Text>
              <Text style={styles.menuSubText}>Versão e informações</Text>
            </View>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Logout Funcional com Wrapper de Toque */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
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
      paddingTop: 32,
      paddingBottom: 40,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 40,
    },
    avatarContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 3,
      borderColor: c.onPrimary,
      shadowColor: c.title,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '800',
      color: c.title,
    },
    userName: {
      fontSize: 22,
      fontWeight: '800',
      color: c.title,
    },
    userEmail: {
      fontSize: 14,
      color: c.textSecondary,
      marginTop: 4,
    },
    menuContainer: {
      backgroundColor: c.card,
      borderRadius: 24,
      paddingVertical: 8,
      marginBottom: 32,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    menuIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    iconFallbackText: {
      fontSize: 14,
      fontWeight: '800',
      color: c.title,
    },
    menuTextWrap: {
      flex: 1,
    },
    menuText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.title,
    },
    menuSubText: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
    },
    chevron: {
      fontSize: 20,
      fontWeight: '600',
      color: c.iconeSutil,
    },
    logoutWrapper: {
      marginTop: 'auto',
      marginBottom: 20,
      zIndex: 99,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.destaqueSuave,
      paddingVertical: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.errorBackground,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.error,
    },
  });
}