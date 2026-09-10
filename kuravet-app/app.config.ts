/// <reference types="node" />
import type { ExpoConfig } from 'expo/config';

// Base URL da API Java, por ambiente — nunca fixa aqui, porque este arquivo é versionado e o IP
// de rede local de cada dev/rede é efêmero (troca de rede, DHCP, etc.), além de nunca dever ir
// para o Git (ver docs/RODANDO_LOCAL.md). O valor real vem de KURAVET_API_BASE_URL, lida de
// .env.local (gitignorado por .gitignore > '.env*.local', um arquivo por máquina/rede) — o próprio
// Expo CLI carrega .env* para process.env antes de avaliar este arquivo, sem dependência extra.
// Sem .env.local, cai no fallback abaixo (correto para Expo Web na mesma máquina do backend). Ver
// README.md, seção "Base URL por ambiente", para o valor certo por ambiente (Web/emulador/device
// físico) e docs/RODANDO_LOCAL.md para o passo a passo de configuração.
const apiBaseUrl = process.env.KURAVET_API_BASE_URL ?? 'http://localhost:8080/api';

const config: ExpoConfig = {
  name: 'kuravet-app',
  slug: 'kuravet-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'kuravetapp',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-secure-store',
    // Registrado automaticamente por `expo install --fix`/expo-doctor ao detectar que
    // expo-image (já em dependencies) tem plugin de config nesta versão — mantido em paridade
    // com o app.json anterior, não é uma decisão deste arquivo.
    'expo-image',
    // Permite tráfego HTTP em claro (sem TLS) no Android — a partir do target SDK usado pelo
    // Expo SDK 57, o Android bloqueia por padrão qualquer requisição para um host não-HTTPS
    // (network security config default), o que quebra a chamada contra a API Java rodando em
    // HTTP no IP local da rede de desenvolvimento. `android.usesCleartextTraffic` não existe mais
    // como propriedade direta do ExpoConfig nesta versão — o mecanismo real é este plugin
    // (`expo-build-properties`), que edita o AndroidManifest nativo. [SÓ DESENVOLVIMENTO LOCAL] —
    // ver docs/RODANDO_LOCAL.md: a entrega de DevOps expõe a API via HTTPS, e este plugin deve
    // ser removido (ou restrito por variante de build) quando isso acontecer.
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  experiments: {
    reactCompiler: true,
  },
  extra: {
    apiBaseUrl,
  },
};

export default config;
