import Constants from 'expo-constants';

export interface InfoApp {
  nome: string;
  versao: string;
  versionCode: string;
  commitHash: string;
  commitCurto: string;
  perfilBuild: string;
  servidorApi: string;
}

const DESCONHECIDO = 'desconhecido';

function paraTextoSeguro(valor: unknown): string {
  return typeof valor === 'string' && valor.trim().length > 0 ? valor : DESCONHECIDO;
}

function extrairHost(valor: unknown): string {
  if (typeof valor !== 'string' || !valor.trim()) {
    return DESCONHECIDO;
  }
  const semProtocolo = valor.replace(/^[a-zA-Z]+:\/\//, '');
  const host = semProtocolo.split('/')[0];
  return host || DESCONHECIDO;
}

export function obterInfoApp(): InfoApp {
  const config = Constants.expoConfig;
  const extra: Record<string, unknown> = (config?.extra ?? {}) as Record<string, unknown>;

  const nome = paraTextoSeguro(config?.name);
  const versao = paraTextoSeguro(config?.version);
  const versionCode =
    typeof config?.android?.versionCode === 'number'
      ? String(config.android.versionCode)
      : DESCONHECIDO;

  const commitHash = paraTextoSeguro(extra.commitHash);
  const commitCurto = commitHash !== DESCONHECIDO ? commitHash.substring(0, 7) : DESCONHECIDO;
  const perfilBuild = paraTextoSeguro(extra.buildProfile);
  const servidorApi = extrairHost(extra.apiBaseUrl);

  return { nome, versao, versionCode, commitHash, commitCurto, perfilBuild, servidorApi };
}
