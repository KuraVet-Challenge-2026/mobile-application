# CLAUDE.md — kuravet-app

Contexto permanente para trabalhar neste repositório (app mobile do Challenge FIAP 2026,
cliente parceiro **CLYVO VET**). Ler antes de qualquer alteração de código. Ver também
`docs/API_CONTRACT.md` (endpoints da API Java), `docs/RUBRICA.md` (critérios de avaliação e
penalidades da Sprint 3), `docs/AUDITORIA.md` (rastreamento vivo de decisões/violações/gaps — a
fonte mais atualizada do estado real do projeto) e `docs/PEDIDO_BACKEND.md` (pedido formal ao time
do `java-advanced`).

## O produto

App mobile para o **tutor** (responsável pelo pet) acompanhar a jornada contínua de cuidado do
animal junto à clínica veterinária — ver `docs/briefing-clyvo.pdf`. Pilares esperados pelo
cliente: preventivo (vacinas/vermífugo/check-up), continuidade terapêutica, bem-estar contínuo,
e um componente de IA para personalização (a IA em si é entregável de outra disciplina do
Challenge, não deste repositório — mas o app deve estar pronto para consumi-la).

O backend real disponível hoje é a API Java (Spring Boot) de teleconsulta veterinária — ver
`docs/API_CONTRACT.md`. Ela cobre um subconjunto do briefing (pets, tutores, consultas/
teleconsulta), não a jornada completa (sem vacinas, sem lembretes, sem IA ainda).

## Stack e versões reais (de `package.json`, 2026-09-02)

- Expo SDK ~57, React Native 0.86.2, React 19.2.3.
- TypeScript ~6.0.3 (ver `tsconfig.json`).
- Navegação: `@react-navigation/native` 7.x + `@react-navigation/native-stack` 7.x. Decisão do
  projeto (2026-09-02): **fica assim**, sem expo-router — ver regra 3 abaixo.
- Dados/servidor: `@tanstack/react-query` 5.101.4, `axios` 1.19.0.
- Autenticação: **Firebase removido por completo (Fase 2, 2026-09-03)** — fora de `package.json`,
  sem `src/config/firebaseConfig.ts`, sem nenhum `import ... from 'firebase/*'` no repositório (ver
  regra 4 e `docs/AUDITORIA.md`). Fonte única de identidade: API Java, via `expo-secure-store`
  (`~57.0.3`) guardando as credenciais, lido por um interceptor do axios (`src/api/client.ts`) e
  por `src/auth/AuthContext.tsx` (`login`, `cadastro`, `logout`, bootstrap de sessão).
- Config do Expo: `app.config.ts` (não `app.json` — removido em 2026-09-09, ver
  `docs/AUDITORIA.md`), para poder ler a base URL da API de uma variável de ambiente
  (`KURAVET_API_BASE_URL`, via `.env.local`, gitignorado) em vez de um valor estático versionado —
  ver `docs/RODANDO_LOCAL.md`.
- `expo-glass-effect`, `expo-image`, `expo-symbols`, `@expo/ui` presentes mas não usados nas
  telas atuais — disponíveis para UI nativa/liquid glass se necessário.
- Lint: `eslint` 9 + `eslint-config-expo`. Sem Prettier configurado.
- Sem Jest/testes configurados.
- Entry point: `index.js` → `registerRootComponent(App)` (padrão Expo clássico, não expo-router).

## Convenções de código observadas

- Comentários em português, densos e explicativos — cada decisão não óbvia (timeout do axios,
  por que `useEffect` X, por que fallback Y) é documentada inline no próprio arquivo. Manter esse
  padrão ao editar: comente o "porquê", não o "o quê".
- Nomes de variáveis/estado em português (`nome`, `senha`, `isLoading`, `mostrarLogo`).
- Paleta de cores replicada como `const COLORS = {...}` no topo de cada tela que usa UI custom
  (`Login.tsx`, `Cadastro.tsx`, `CadastroPet.tsx`) em vez de um tema centralizado — inconsistente,
  candidato a virar `src/theme/colors.ts` quando mais telas precisarem da mesma paleta.
- `StyleSheet.create` no fim de cada arquivo de tela, um arquivo por tela — sem CSS-in-JS externo.
- Tipagem de navegação via `RootStackParamList` centralizado em `src/routes/index.tsx`.
- DTOs da API tipados diretamente com os tipos reais de `src/types/` (`PetInput`/`Pet`,
  `TutorInput`/`Tutor`, `Consulta`, `CadastroInput`, `UsuarioAutenticado`, etc.) — nenhum tipo
  defensivo/`any` para payload de API deve ser reintroduzido agora que `docs/API_CONTRACT.md`
  documenta os DTOs reais.
- Erros de usuário: `Alert.alert(...)` para falhas de ação, texto inline (`errorText`/`formErro`)
  para validação de formulário. `getApiErrorMessage` (`src/utils/apiErrorMessage.ts`) centraliza a
  tradução de erro técnico → mensagem amigável para toda chamada à API Java (lê `mensagem`/`campos`
  do `ApiExceptionHandler`, ver `docs/API_CONTRACT.md`, seção Erros).
- **Sem emojis** — nem na interface (usar ícone vetorial ou texto), nem em nenhum documento do
  projeto (`CLAUDE.md`, `docs/**`, `README.md`): usar marcadores textuais entre colchetes (ex.:
  `[BLOQUEANTE]`, `[ATENÇÃO]`, `[GAP]`) no lugar de ⚠️/✅/❌ etc. Regra estendida a documentação em
  2026-09-02 — ver `docs/AUDITORIA.md` seção 1.

## Estrutura de pastas — atual vs. alvo

Atual (`src/`), após a Fase 2 (Auth real + fim do Firebase, 2026-09-03):
```
src/
├── api/client.ts            # instância axios + interceptor de Authorization (SecureStore)
├── auth/
│   ├── AuthContext.tsx      # AuthProvider/useAuth — status de sessão, login(), cadastro(), logout()
│   ├── secureCredentials.ts # salvar/ler/limpar credenciais (via secureStorage)
│   ├── secureStorage.ts     # armazenamento seguro nativo (Android/iOS, expo-secure-store)
│   └── secureStorage.web.ts # fallback SÓ DE DEV para web (localStorage, não seguro) — ver README.md
├── components/
│   └── FormularioPet.tsx    # form de Pet (nome/espécie/raça/sexo/nascimento), compartilhado por
│                             # CadastroPet.tsx (Create) e EditarPetScreen.tsx (Update) — primeiro
│                             # componente reutilizável do projeto (2026-09-09)
├── hooks/                   # useQuery/useMutation isolados por domínio — useConsultas (Home.tsx),
│                             # useTutores (sem consumidor hoje, ver docs/AUDITORIA.md V3),
│                             # usePets (usePets/usePet/useCriarPet/useAtualizarPet/useExcluirPet —
│                             # CRUD completo de Pet, ver docs/AUDITORIA.md seção 3)
├── routes/index.tsx         # RootStackParamList + guard (AuthStackNavigator/AppStackNavigator)
├── screens/                 # uma tela = um arquivo, sem subpastas
├── types/                   # tipos espelhando os DTOs reais da API (index.ts é o barrel)
└── utils/                   # tradução de mensagens de erro + base64.ts (header Basic Auth)
```

Alvo — o que ainda falta criar, para atender a regra "arquitetura e organização do código" da
rubrica:
```
src/
└── theme/                   # paleta de cores centralizada (hoje duplicada em cada tela, ver
                              # convenção abaixo) — fica para a fase de design system, fora do
                              # escopo do CRUD (`src/components/` já existe, ver acima)
```

## Regras invioláveis

1. **Zero dados mockados.** Toda informação em tela vem da API via TanStack Query. Não usar
   arrays fixos como substituto de resposta real.
2. **Zero fetch/axios dentro de componente de tela.** Sempre em hooks isolados
   (`src/hooks/useX.ts`), nunca `api.get`/`api.post` direto dentro de `src/screens/**`.
3. **Navegação exclusivamente por rotas declaradas no React Navigation.** Proibido misturar
   bibliotecas de navegação (não introduzir expo-router) e proibido usar renderização condicional
   (`if`/`useState`) como substituto de rota. Toda tela nova precisa de uma entrada explícita em
   `RootStackParamList` (`src/routes/index.tsx`) e ser alcançada via `navigation.navigate(...)`.
   *(Correção de 2026-09-02: a versão anterior desta regra citava expo-router por engano — o
   projeto usa e continua usando React Navigation.)*
4. **Autenticação real com persistência de sessão, direto contra a API Java.** Fonte única de
   identidade: Spring Security / HTTP Basic da API (`docs/API_CONTRACT.md`). Credenciais
   (username/senha) ficam em **`expo-secure-store`**, nunca em `AsyncStorage`, nunca
   hardcoded/no código-fonte. Nunca usuário fixo no código. **Firebase removido por completo na
   Fase 2 (2026-09-03)** — ver `docs/AUDITORIA.md`.
5. **Nenhum segredo commitado.** Nunca commitar credenciais de banco, tokens de API, senhas de
   usuário de teste em texto (a API Java já segue essa prática — usuários de teste documentados no
   `README.md` dela, não em `.env` versionado).
6. **Commits pequenos e frequentes, mensagens descritivas em português.** A penalidade V da
   rubrica (-50 pts, "histórico de commits incoerente, inexistente ou artificial") é uma das mais
   caras da Sprint 3 — nunca fazer um commit único grande por feature.

## Decisões tomadas

Registro completo, com data e justificativa, em `docs/AUDITORIA.md` — resumo aqui:

1. **Autenticação** (2026-09-02, executado na Fase 2/2026-09-03): abandonar Firebase. Fonte única
   de identidade é a API Java (Spring Security/HTTP Basic). Credenciais em `expo-secure-store`.
   Interceptor de `Authorization` no axios (`src/api/`). Os endpoints `POST /api/auth/cadastro` e
   `GET /api/auth/me` estão implementados no backend (confirmado 2026-09-03) e consumidos por
   `src/auth/AuthContext.tsx` (`login`, `cadastro`, bootstrap de sessão).
2. **Navegação**: mantém React Navigation, não migra para expo-router. Regra 3 acima já reflete a
   redação corrigida.
3. **CRUD viável hoje**: ver `docs/AUDITORIA.md` seção "CRUD por entidade" — **Pet** e **Tutor**
   são viáveis sem mudança no backend; **Consulta/Teleconsulta** está bloqueada até
   `GET /api/veterinarios` existir.

## Estado atual (o que já está feito)

- **Telas existentes (12, 2 delas stub vazio):** Login, Cadastro, Home, CadastroPet, PetsList,
  PetDetalhe, EditarPet, EditarPerfil, HistoricoDiagnostico (stub — só título), Teleconsulta
  (stub — só título), Perfil, Configuracoes.
- **Navegação:** `src/routes/index.tsx` tem um guard real — `RootNavigator` escolhe entre
  `AuthStackNavigator` (Login/Cadastro) e `AppStackNavigator` (as outras 10 telas) a partir de
  `useAuth().status`, com uma tela de loading durante a reidratação da sessão. `Login.tsx` e
  `Cadastro.tsx` chamam `useAuth().login(...)`/`useAuth().cadastro(...)` e nunca navegam
  manualmente para `Home` — a troca de stack é 100% pelo guard, reagindo ao `status`.
- **Autenticação:** 100% via API Java (Fase 2, 2026-09-03). `src/auth/AuthContext.tsx` +
  `src/auth/secureCredentials.ts` (Fase 1) conectados a `Login.tsx`, `Cadastro.tsx`,
  `PerfilScreen.tsx` e `ConfiguracoesScreen.tsx` — nenhuma tela usa Firebase ou qualquer forma de
  auth fora do `AuthContext`.
- **Integração com API:** `src/api/client.ts` — `baseURL` configurável via `app.config.ts` >
  `expo.extra.apiBaseUrl` (lida de `KURAVET_API_BASE_URL` em `.env.local`, gitignorado — ver
  `docs/RODANDO_LOCAL.md`), interceptor assina `Authorization: Basic ...` a partir do
  `expo-secure-store` quando há sessão salva. `Home.tsx` usa `useConsultas()` (`GET /consultas`,
  `src/hooks/`), sem mock. Pet usa `src/api/pets.ts` + `src/hooks/usePets.ts` (ver item abaixo).
- **CRUD implementado no app, por entidade:**
  - Pet: **completo** (2026-09-09) — Create (`CadastroPet.tsx`), Read/lista (`PetsListScreen.tsx`),
    Read/detalhe (`PetDetalheScreen.tsx`), Update (`EditarPetScreen.tsx`), Delete (confirmação em
    `PetDetalheScreen.tsx`). Camadas: `src/api/pets.ts` (funções tipadas) → `src/hooks/usePets.ts`
    (`useQuery`/`useMutation`, invalidação de `['pets']`) → telas. Ver `docs/AUDITORIA.md` seção 3.
  - Tutor: **completo** (2026-09-09), escopado a "Meu Perfil" — Create via `Cadastro.tsx`
    (`POST /api/auth/cadastro`), Read completo em `ConfiguracoesScreen.tsx`
    (`GET /api/tutores/{idTutor}`), Update em `EditarPerfilScreen.tsx`
    (`PUT /api/tutores/{idTutor}`), Delete ("excluir conta", com confirmação + logout) em
    `ConfiguracoesScreen.tsx` (`DELETE /api/tutores/{idTutor}`). `idTutor` sempre de
    `useAuth().usuario.idTutor` — nenhuma tela aceita id arbitrário (mitigação ao gap de
    ownership do `TutorController`, ver `docs/AUDITORIA.md` seção 3). Camadas: `src/api/tutores.ts`
    → `src/hooks/useTutores.ts` (`useTutor`/`useAtualizarTutor`/`useExcluirTutor`) → telas.
  - Consulta/Teleconsulta: nenhuma operação implementada — `TeleconsultaScreen.tsx` é stub vazio,
    apesar de aparecer como ação rápida na Home.
  - Histórico de diagnóstico: nenhuma operação implementada — stub vazio.
- **Loading/erro:** `Login.tsx`, `Cadastro.tsx`, `Home.tsx`, `CadastroPet.tsx`, `PetsListScreen.tsx`,
  `PetDetalheScreen.tsx` e `EditarPetScreen.tsx` tratam `isLoading`/`isError`/`isPending`
  (TanStack Query) ou seu próprio `isLoading` (auth) com feedback visual (spinner, texto de erro,
  botão desabilitado, estado de lista vazia); erros da API traduzidos por `getApiErrorMessage`
  (`src/utils/apiErrorMessage.ts`).
- **Estrutura de pastas:** `src/hooks/` existe (`useConsultas`, `useTutores`, `usePets`);
  `src/components/` existe desde 2026-09-09 (`FormularioPet.tsx`); ainda sem `src/theme/` — ver
  "Estrutura de pastas — alvo" acima.
- **Assets:** logo com fallback tolerante a falha (`Login.tsx`/`Cadastro.tsx`), paleta de cor
  documentada em `assets/` via `mockup-referencia.png`.

## O que falta para fechar a Sprint 3 (visão rápida — não é o plano de execução)

Ver `docs/RUBRICA.md` seção 1 para o checklist completo pontuado, e `docs/AUDITORIA.md` para o
rastreamento vivo de cada violação/gap com status. As duas funcionalidades de CRUD completo da
rubrica estão fechadas (**Pet** e **Tutor**/"Meu Perfil") — Consulta/Teleconsulta fica fora da
Sprint 3 (decisão de 2026-09-09, sem `GET /api/veterinarios`). Pendente: correção de ownership em
`TutorController` no backend (item 3 de `docs/PEDIDO_BACKEND.md`, fora do controle do mobile,
mitigado no app); paleta de cor centralizada (`src/theme/`) — fase de design system; um
`README.md` real com vídeo demonstrativo (o atual descreve plataforma/execução, mas ainda não tem
o vídeo exigido pela rubrica seção 1.5).
