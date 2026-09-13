import axios from 'axios';
import Constants from 'expo-constants';

import { montarHeaderBasicAuth, obterCredenciais } from '../auth/secureCredentials';

const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,

  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(async (config) => {
  if (config.headers.has('Authorization')) {
    return config;
  }

  const credenciais = await obterCredenciais();
  if (credenciais) {
    config.headers.set('Authorization', montarHeaderBasicAuth(credenciais));
  }

  return config;
});

export default apiClient;
