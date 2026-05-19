import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  // carrega a sessão se o utilizador já tiver feito login antes
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@KuraVet:userSession');
      if (storageUser) setUser(JSON.parse(storageUser));
    }
    loadStorageData();
  }, []);

  // cadastrar nova conta
  const register = async (email: string, senha: string) => {
    if (!email.includes('@') || senha.length < 4) {
      Alert.alert('Erro', 'Insira um e-mail válido (ex: gmail) e uma senha de no mínimo 4 caracteres.');
      return false;
    }
    
    const newAccount = { email, senha };
    // Salva a conta na base de dados local
    await AsyncStorage.setItem('@KuraVet:tutorAccount', JSON.stringify(newAccount));
    Alert.alert('Sucesso', 'Conta criada! Agora você já pode fazer login.');
    return true; 
  };

  // fazer Login
  const login = async (email: string, senha: string) => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, informe e-mail e senha.');
      return;
    }

    // busca a conta registada no banco
    const storedAccountData = await AsyncStorage.getItem('@KuraVet:tutorAccount');
    
    if (!storedAccountData) {
      Alert.alert('Erro', 'Nenhuma conta encontrada. Cadastre-se primeiro.');
      return;
    }

    const storedAccount = JSON.parse(storedAccountData);

    // valida se as credenciais 
    if (email === storedAccount.email && senha === storedAccount.senha) {
      const sessionUser = { id: '1', email };
      setUser(sessionUser);
      await AsyncStorage.setItem('@KuraVet:userSession', JSON.stringify(sessionUser));
    } else {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@KuraVet:userSession');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};