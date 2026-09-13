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
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  avisar();
  try {
    window.localStorage.setItem(key, value);
  } catch {

  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    window.localStorage.removeItem(key);
  } catch {

  }
}
