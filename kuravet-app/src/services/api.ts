import axios from 'axios';

// Placeholder: troque pelo IP local da máquina que roda o backend Java na sua rede
// (descubra com `ipconfig` no Windows). Em emulador/dispositivo físico, 'localhost'
// aponta para o próprio dispositivo, não para o computador de desenvolvimento.
const BASE_URL = 'http://192.168.x.x:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  // 60s: segura a interface (loading) esperando o backend responder antes de
  // estourar erro, cobrindo processamentos mais lentos da API Java.
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
