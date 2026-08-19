import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do projeto Firebase (Console > Configurações do projeto > Seus apps).
const firebaseConfig = {
  apiKey: 'AIzaSyAfm2D3L3ExksR900KQBBwK_0YX3HdwMCg',
  authDomain: 'kuravet.firebaseapp.com',
  projectId: 'kuravet',
  storageBucket: 'kuravet.firebasestorage.app',
  messagingSenderId: '578871327261',
  appId: '1:578871327261:web:7aaad5bca0caa7120e24f4',
  measurementId: 'G-VC5P6EH23N',
};

// Evita inicializar o app do Firebase mais de uma vez (Fast Refresh / múltiplos imports).
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Nota: `getAnalytics` (firebase/analytics) foi propositalmente omitido aqui.
// Ele depende de APIs de browser (window/document/indexedDB) que não existem
// em React Native e derruba o app ao ser chamado. Para analytics em mobile,
// use o módulo nativo `@react-native-firebase/analytics` em vez do SDK web.

// Nota: `getAuth` usa persistência em memória por padrão em React Native (a
// sessão não sobrevive a um reload do app). Para persistir o login entre
// sessões, instale `@react-native-async-storage/async-storage` e troque por
// `initializeAuth(firebaseApp, { persistence: getReactNativePersistence(AsyncStorage) })`.
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
export default auth;
