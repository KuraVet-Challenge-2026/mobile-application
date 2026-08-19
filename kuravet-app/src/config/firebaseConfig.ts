import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: preencher com as credenciais do projeto no Firebase Console
// (Configurações do projeto > Geral > Seus apps > SDK setup and configuration).
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// Evita inicializar o app do Firebase mais de uma vez (Fast Refresh / múltiplos imports).
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
export default auth;
