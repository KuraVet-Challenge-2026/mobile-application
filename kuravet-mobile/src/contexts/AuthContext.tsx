import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@KuraVet:user');
      if (storageUser) setUser(JSON.parse(storageUser));
    }
    loadStorageData();
  }, []);

  const login = async (email: string, senha: string) => {
    if (!email.includes('@')) {
      Alert.alert('Erro de Validação', 'Por favor, insira um e-mail válido contendo @.');
      return;
    }

    if (email && senha) {
      const mockUser = { id: '1', email };
      setUser(mockUser);
      await AsyncStorage.setItem('@KuraVet:user', JSON.stringify(mockUser));
    } else {
      Alert.alert('Erro', 'Por favor, informe e-mail e senha.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@KuraVet:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};