import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import apiClient from '../api/client';
import type { CadastroInput, CadastroResponse, UsuarioAutenticado } from '../types';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import {
  limparCredenciais,
  montarHeaderBasicAuth,
  obterCredenciais,
  salvarCredenciais,
} from './secureCredentials';

type AuthStatus = 'carregando' | 'autenticado' | 'nao-autenticado';

type AuthContextValue = {
  status: AuthStatus;
  usuario: UsuarioAutenticado | null;
  login: (username: string, senha: string) => Promise<void>;
  cadastro: (dados: CadastroInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function buscarUsuarioAutenticado(headerAutorizacao: string): Promise<UsuarioAutenticado> {
  const { data } = await apiClient.get<UsuarioAutenticado>('/auth/me', {
    headers: { Authorization: headerAutorizacao },
  });
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('carregando');
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      const credenciais = await obterCredenciais();
      if (!credenciais) {
        if (!cancelado) setStatus('nao-autenticado');
        return;
      }

      try {
        const usuarioAutenticado = await buscarUsuarioAutenticado(montarHeaderBasicAuth(credenciais));
        if (cancelado) return;
        setUsuario(usuarioAutenticado);
        setStatus('autenticado');
      } catch {

        await limparCredenciais();
        if (!cancelado) {
          setUsuario(null);
          setStatus('nao-autenticado');
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  const login = useCallback(async (username: string, senha: string) => {
    const headerAutorizacao = montarHeaderBasicAuth({ username, senha });

    let usuarioAutenticado: UsuarioAutenticado;
    try {
      usuarioAutenticado = await buscarUsuarioAutenticado(headerAutorizacao);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Usuário ou senha inválidos.');
      }
      throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
    }

    await salvarCredenciais({ username, senha });
    setUsuario(usuarioAutenticado);
    setStatus('autenticado');
  }, []);

  const cadastro = useCallback(
    async (dados: CadastroInput) => {
      try {
        await apiClient.post<CadastroResponse>('/auth/cadastro', dados);
      } catch (error) {
        throw new Error(
          getApiErrorMessage(error, 'Não foi possível concluir o cadastro. Tente novamente.')
        );
      }

      await login(dados.username, dados.senha);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await limparCredenciais();
    setUsuario(null);
    setStatus('nao-autenticado');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, usuario, login, cadastro, logout }),
    [status, usuario, login, cadastro, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider (ver App.tsx).');
  }
  return context;
}
