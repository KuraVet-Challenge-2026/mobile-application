import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante a configuração correta tanto no Expo Go quanto em builds nativos ou na web.
registerRootComponent(App);
