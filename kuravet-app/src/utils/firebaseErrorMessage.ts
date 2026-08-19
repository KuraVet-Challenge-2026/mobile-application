// Mapeia os códigos de erro mais comuns do Firebase Authentication (formato
// "auth/xxx") para mensagens amigáveis em português. Compartilhado entre
// Login.tsx e Cadastro.tsx para manter as duas telas consistentes e evitar
// duplicar a lista de códigos em cada arquivo.
const MENSAGENS_POR_CODIGO: Record<string, string> = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente fazer login.',
  'auth/invalid-email': 'O e-mail informado é inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/user-not-found': 'Não encontramos uma conta com este e-mail.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento e tente novamente.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet e tente novamente.',
  'auth/operation-not-allowed': 'Login por e-mail e senha não está habilitado no momento.',
};

const MENSAGEM_PADRAO = 'Não foi possível concluir a operação. Tente novamente em instantes.';

// Extrai o `code` do erro sem depender da classe `FirebaseError` (evita
// acoplamento à versão exata do SDK) — qualquer objeto com um campo `code`
// string funciona, o que cobre os erros lançados pelo firebase/auth.
function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error as { code: unknown };
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  if (code && MENSAGENS_POR_CODIGO[code]) {
    return MENSAGENS_POR_CODIGO[code];
  }
  return MENSAGEM_PADRAO;
}
