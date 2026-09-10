// Fallback SOMENTE DE DESENVOLVIMENTO da interface de armazenamento seguro (mesmo formato de
// src/auth/secureStorage.ts) para permitir rodar `expo start --web` sem crashar. O Metro escolhe
// este arquivo automaticamente em vez de secureStorage.ts quando o bundle é web (convenção de
// nome `*.web.ts`) — nenhuma outra parte do código (src/auth/secureCredentials.ts,
// src/auth/AuthContext.tsx) precisa saber qual dos dois está rodando.
//
// `expo-secure-store` é um módulo nativo sem implementação web (ver docs/AUDITORIA.md) — chamar
// suas funções no browser derruba o app (`ExpoSecureStore.getValueWithKeyAsync is not a
// function`). O alvo real da entrega da Sprint 3 é nativo (Android/iOS, emulador ou device físico
// — a própria rubrica pede isso); web nunca foi o alvo, só conveniência de desenvolvimento.
//
// `localStorage` NÃO é armazenamento seguro: é texto plano, legível por qualquer script rodando
// na mesma origem (inclusive uma extensão de browser maliciosa ou um XSS). Por isso todo acesso
// aqui avisa alto no console, para nunca passar despercebido como se fosse equivalente ao
// Keychain/Keystore usados em nativo.

const AVISO =
  '[kuravet] expo-secure-store não tem suporte a web — usando localStorage como fallback ' +
  'SOMENTE DE DESENVOLVIMENTO (NÃO é armazenamento seguro). O alvo real da entrega é nativo ' +
  '(Android/iOS, emulador ou device) — ver docs/AUDITORIA.md e README.md.';

function avisar(): void {
  console.warn(AVISO);
}

export async function getItem(key: string): Promise<string | null> {
  avisar();
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Ambiente sem localStorage disponível (ex.: SSR) — trata como "nada salvo" em vez de
    // derrubar o app, mesmo espírito defensivo do restante de src/auth/.
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  avisar();
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ver comentário em getItem.
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ver comentário em getItem.
  }
}
