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

// 'carregando': ainda reidratando a sessão salva no device, na abertura do app — nenhuma decisão
// de navegação deve ser tomada nesse estado (ver src/routes/index.tsx).
type AuthStatus = 'carregando' | 'autenticado' | 'nao-autenticado';

type AuthContextValue = {
  status: AuthStatus;
  usuario: UsuarioAutenticado | null;
  login: (username: string, senha: string) => Promise<void>;
  cadastro: (dados: CadastroInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// GET /api/auth/me — implementado no backend java-advanced (confirmado 2026-09-03, ver
// docs/API_CONTRACT.md). Se a chamada falhar (rede fora do ar, credencial inválida etc.),
// login()/o bootstrap abaixo tratam isso como "sem sessão" em vez de derrubar o app.
async function buscarUsuarioAutenticado(headerAutorizacao: string): Promise<UsuarioAutenticado> {
  const { data } = await apiClient.get<UsuarioAutenticado>('/auth/me', {
    headers: { Authorization: headerAutorizacao },
  });
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('carregando');
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);

  // Bootstrap: ao abrir o app, tenta reidratar a sessão a partir do expo-secure-store. Sem
  // isso, o usuário precisaria logar toda vez que reabrisse o app (violaria a regra 4 do
  // CLAUDE.md — persistência de sessão).
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
        // Credencial salva não é mais válida (senha trocada no backend, etc.) ou o endpoint de
        // validação ainda não existe — trata como "sem sessão" em vez de travar o app num
        // estado incerto.
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

    // Valida a combinação usuário/senha ANTES de persistir — nunca grava no device uma
    // credencial ainda não confirmada pelo backend.
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

  // POST /api/auth/cadastro — cria Tutor + Usuario (perfil TUTOR) em uma única transação (ver
  // docs/API_CONTRACT.md). A resposta não inclui a senha (nunca deveria), então depois de criar
  // a conta reaproveitamos login() com as mesmas credenciais digitadas: isso garante o mesmo
  // contrato de login() (só persiste credencial já validada contra a API) sem duplicar a lógica
  // de buscar o usuário autenticado e gravar no expo-secure-store.
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
