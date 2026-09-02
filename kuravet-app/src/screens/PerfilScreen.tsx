import React, { useEffect, useState } from 'react';
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

import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';

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
  const [userInfo, setUserInfo] = useState({
    nome: '',
    email: '',
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserInfo({
        nome: currentUser.displayName || 'Usuário KuraVet',
        email: currentUser.email || 'E-mail não cadastrado',
      });
    }
  }, []);

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
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
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
            <Text style={styles.avatarText}>{getInitials(userInfo.nome)}</Text>
          </View>
          <Text style={styles.userName}>{userInfo.nome}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
        </View>

        {/* Menu contendo apenas Configurações */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconWrap}>
              <Text style={styles.iconFallbackText}>CF</Text>
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuText}>Configurações</Text>
              <Text style={styles.menuSubText}>Notificações e preferências do app</Text>
            </View>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDEBF7',
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
    backgroundColor: '#C9DEF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1E4E79',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E4E79',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E4E79',
  },
  userEmail: {
    fontSize: 14,
    color: '#4C7EA8',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#F2F7FC',
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
    backgroundColor: '#DDEBF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconFallbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E4E79',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E4E79',
  },
  menuSubText: {
    fontSize: 12,
    color: '#4C7EA8',
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '600',
    color: '#A3C1DA',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE8E8',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F9DEDC',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B3261E',
  },
});