import * as SecureStore from 'expo-secure-store';

// Implementação nativa (Android/iOS) da interface de armazenamento seguro consumida por
// src/auth/secureCredentials.ts. `expo-secure-store` não tem implementação para web — o Metro
// resolve automaticamente `secureStorage.web.ts` nesse caso (ver esse arquivo ao lado e
// docs/AUDITORIA.md), então este arquivo só roda em Android/iOS/emulador, nunca no browser. Sem
// mudança de comportamento em relação ao que já existia antes desta separação: continua
// Keychain (iOS) / Keystore-EncryptedSharedPreferences (Android) via `expo-secure-store`.

export async function getItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
