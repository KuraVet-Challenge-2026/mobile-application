/// <reference types="node" />
import { execSync } from 'node:child_process';
import type { ExpoConfig } from 'expo/config';

const apiBaseUrl = process.env.KURAVET_API_BASE_URL ?? 'http://localhost:8080/api';

if (process.env.EAS_BUILD && !process.env.KURAVET_API_BASE_URL) {
  throw new Error(
    'KURAVET_API_BASE_URL não definida: build EAS não pode cair no fallback localhost.',
  );
}

function resolveCommitHash(): string {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  }
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'desconhecido';
  }
}

const config: ExpoConfig = {
  name: 'KuraVet',
  slug: 'kuravet-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/logo.png',
  scheme: 'kuravetapp',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/logo.png',
  },
  android: {
    package: 'br.com.fiap.kuravet',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#DDEBF7',
      foregroundImage: './assets/logo.png',
      backgroundImage: './assets/logo.png',
      monochromeImage: './assets/logo.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'single',
    favicon: './assets/logo.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#DDEBF7',
        image: './assets/logo.png',
        imageWidth: 76,
      },
    ],
    'expo-secure-store',

    'expo-image',

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
    commitHash: resolveCommitHash(),
    buildProfile: process.env.EAS_BUILD_PROFILE ?? 'local',
  },
};

export default config;
