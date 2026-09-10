# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Plataforma alvo

Este app é feito para rodar **nativo — Android ou iOS, emulador ou device físico**. É isso que a
rubrica da Sprint 3 avalia, e é o único ambiente com armazenamento de credenciais real
(`expo-secure-store`, Keychain no iOS / Keystore no Android).

`expo start --web` também funciona, mas é só conveniência de desenvolvimento (preview rápido de
UI) — **nunca use web para validar o fluxo de autenticação**: `expo-secure-store` não roda no
browser, então nesse modo o app cai automaticamente para um fallback inseguro sobre `localStorage`
(`src/auth/secureStorage.web.ts`), avisando alto no console toda vez que é usado. Ver
`docs/AUDITORIA.md`, seção "Plataforma alvo: nativo, não web", para o racional completo.

## Base URL por ambiente

A base URL da API Java vem da variável de ambiente `KURAVET_API_BASE_URL`, lida em
`app.config.ts` e exposta ao app via `expo.extra.apiBaseUrl` (ver `src/api/client.ts`). Ela mora
em `.env.local` — **gitignorado** (`.gitignore` > `.env*.local`), um arquivo por
máquina/rede — nunca em `app.config.ts` nem em nenhum outro arquivo versionado. Copie
`.env.example` para `.env.local` e ajuste o valor; sem `.env.local`, o fallback é
`http://localhost:8080/api` (ver `docs/RODANDO_LOCAL.md` para o passo a passo completo).

`localhost` significa coisas diferentes dependendo de quem está fazendo a requisição, por isso não
existe um valor único que funcione em todos os ambientes:

| Ambiente | Quem faz a requisição | Valor de `KURAVET_API_BASE_URL` | Por quê |
|---|---|---|---|
| Expo Web (`expo start --web`) | O navegador, na própria máquina onde a API Java roda | `http://localhost:8080/api` | Navegador e backend estão no mesmo host — `localhost` resolve certo. **Valor padrão (fallback) do projeto.** |
| Emulador Android (AVD) | Uma VM isolada, não a máquina host | `http://10.0.2.2:8080/api` | `10.0.2.2` é o alias fixo que o emulador Android usa para "a máquina host que o hospeda" — `localhost` de dentro da VM aponta para a própria VM, não para o seu PC. |
| Device físico via Expo Go (mesma rede Wi-Fi) | O aparelho, um computador separado na rede | `http://<IP-da-sua-máquina-na-rede-local>:8080/api` (ex.: `http://192.168.0.42:8080/api`) | O celular não tem acesso nenhum a `localhost`/`10.0.2.2` do seu PC — só enxerga sua máquina pelo IP dela na rede local. Ver passo a passo abaixo. |

Não deixar o IP fixo de uma rede específica (ex.: um adaptador de VM tipo VirtualBox Host-Only)
como valor de `.env.local` esquecido entre trocas de rede — ele só existe naquele computador/rede,
e quebra silenciosamente (timeout, sem mensagem clara) em qualquer outra.

## Como rodar em emulador Android

Pré-requisitos: Android Studio com um AVD (emulador) criado, e a API Java (`java-advanced`)
rodando localmente.

1. Abra o AVD Manager do Android Studio e inicie um emulador.
2. Em `.env.local`, ajuste `KURAVET_API_BASE_URL` para `http://10.0.2.2:8080/api` (ver tabela
   acima).
3. Na raiz de `kuravet-app`: `npm install` (se ainda não rodou) e depois `npx expo start --android`
   (ou `npx expo start` e apertar `a` no terminal interativo).
4. O Metro builda e instala o app no emulador automaticamente — a primeira vez demora mais (build
   nativo).

## Como rodar via Expo Go em device físico

Pré-requisitos: app **Expo Go** instalado no celular (Android ou iOS), celular e computador na
**mesma rede Wi-Fi**, e a API Java (`java-advanced`) rodando localmente.

1. Descubra o IP da sua máquina na rede local:
   - **Windows**: abra um terminal e rode `ipconfig`. Procure o adaptador da rede Wi-Fi/Ethernet
     que está realmente em uso (não o de uma VM tipo VirtualBox/Hyper-V/WSL) e pegue o valor de
     "Endereço IPv4" (formato `192.168.x.x` ou `10.x.x.x`).
   - **macOS/Linux**: `ipconfig getifaddr en0` (Wi-Fi, macOS) ou `hostname -I` (Linux).
2. Em `.env.local` (copie de `.env.example` se ainda não existir), ajuste `KURAVET_API_BASE_URL`
   para `http://<esse-IP>:8080/api` (ex.: `http://192.168.0.42:8080/api`). Ver
   `docs/RODANDO_LOCAL.md` para o passo a passo completo, incluindo o ajuste de tráfego HTTP em
   claro no Android.
3. Confirme que a API Java está de fato escutando em todas as interfaces (padrão do Spring Boot,
   sem `server.address` customizado) — se ela só aceitar `127.0.0.1`, o celular não vai conseguir
   alcançar mesmo com o IP certo.
4. Se houver firewall do Windows ativo, confirme que a porta `8080` aceita conexão de entrada da
   rede local (perfil de rede "Privada"), ou o celular vai ver timeout/conexão recusada mesmo com
   tudo configurado certo.
5. Na raiz de `kuravet-app`: `npx expo start`. O terminal mostra um QR code.
6. Abra o Expo Go no celular e escaneie o QR code (Android: opção de escanear dentro do próprio
   app; iOS: pela câmera nativa, que oferece abrir no Expo Go).
7. O app carrega no celular via Metro (mesma rede) — teste o fluxo de Cadastro/Login normalmente.
   Sessão fica persistida no Keychain/Keystore real do aparelho (`expo-secure-store`), diferente do
   fallback de desenvolvimento usado no Expo Web.

Roteiro para verificar o fluxo cadastro → login → reabrir app → Home → logout:

1. Na tela de Cadastro, preencha nome, CPF, usuário e senha (usuário ainda não usado) e confirme —
   deve cair direto na Home (o guard de navegação troca de stack sozinho, sem passar pelo Login).
2. Feche o app completamente (não só minimizar) e reabra — deve voltar para a Home sem pedir login
   de novo (sessão persistida no Keystore/Keychain via `expo-secure-store`).
3. Na Home, toque no avatar (canto superior direito) para ir a Perfil > "Sair da Conta" > confirme
   — deve voltar para a tela de Login.
4. Faça login de novo com o mesmo usuário/senha do cadastro — deve voltar para a Home.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
