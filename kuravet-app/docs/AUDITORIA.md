# Auditoria — kuravet-app

Documento vivo de rastreamento: decisões de arquitetura tomadas, violações conhecidas das regras
invioláveis (`CLAUDE.md`) e gaps de backend, cada um com status. Atualizar a cada fase concluída —
não deixar este arquivo desalinhado com o código real. Ver também `docs/API_CONTRACT.md` (contrato
da API) e `docs/RUBRICA.md` (critérios pontuados da Sprint 3).

## 1. Log de decisões

| Data | Decisão | Motivo | Registrada em |
|---|---|---|---|
| 2026-09-02 | Abandonar Firebase Authentication. Fonte única de identidade: API Java (Spring Security / HTTP Basic). Credenciais em `expo-secure-store`, nunca `AsyncStorage`, nunca no código. Interceptor de `Authorization` no axios. | Evitar dois sistemas de identidade desconectados (Firebase não autentica contra a API real). | `CLAUDE.md` regra 4, `docs/API_CONTRACT.md` seção Autenticação |
| 2026-09-02 | Manter React Navigation. Não migrar para expo-router. | A rubrica aceita ambos; migrar depois de mais telas escritas seria retrabalho caro; correção de um erro de redação anterior da regra inviolável. | `CLAUDE.md` regra 3, `docs/RUBRICA.md` seção 1.1 |
| 2026-09-02 | Funcionalidades de CRUD completo escolhidas: **Pet** e **Tutor**. Consulta/Teleconsulta fica de fora até o backend expor `GET /api/veterinarios`. | São as únicas duas com CRUD 100% operável sem depender de endpoint novo — ver seção 3 abaixo. | `docs/RUBRICA.md` seção 1.2 |
| 2026-09-02 | Gap de ownership em `TutorController` elevado a **bloqueante**, no mesmo nível dos endpoints de autenticação. | Usuário autenticado conseguir ler/alterar dados de outro tutor é falha de controle de acesso, não um detalhe de polimento. | `docs/AUDITORIA.md` seção 4, `docs/PEDIDO_BACKEND.md` |
| 2026-09-02 | Regra "sem emojis" (já valia para a interface) estendida a toda a documentação do projeto (`CLAUDE.md`, `docs/**`). | Consistência e tom profissional em qualquer artefato que possa ser mostrado à Clyvo Vet ou à banca. | `CLAUDE.md` regra de convenções |
| 2026-09-02 | Fase 1 (Fundação) executada: `src/types/`, `src/api/client.ts` (com interceptor), `src/auth/` (SecureStore + `AuthContext`), guard em `src/routes/index.tsx`. `expo-secure-store` instalado. `src/services/api.ts` removido (virou `src/api/client.ts`). | Ver escopo combinado no início da Fase 1. | Seção 6 abaixo; violações V4/V6/V6b atualizadas na seção 2 |
| 2026-09-03 | Backend (`java-advanced`) confirmou `POST /api/auth/cadastro` e `GET /api/auth/me` implementados — os dois endpoints que bloqueavam a Fase 2 (itens 1/2 de `docs/PEDIDO_BACKEND.md`) deixam de ser gap. | Desbloqueia reescrever Login/Cadastro contra a API real. | Confirmado pelo usuário no início da Fase 2; contrato em `docs/API_CONTRACT.md` tratado como confirmado, não mais proposto, a partir desta data |
| 2026-09-03 | Fase 2 (Auth real + fim do Firebase) executada: Firebase removido por completo; `Login.tsx`/`Cadastro.tsx` reescritos contra `useAuth().login()`/`useAuth().cadastro()`; `CONSULTAS_FALLBACK` removido; `fetchConsultas`/`fetchTutores` movidos para `src/hooks/`; `CadastroPet.tsx` resolve o dono do pet via `useAuth().usuario.idTutor` em vez de buscar todos os tutores e casar por e-mail do Firebase. | Ver escopo combinado no início da Fase 2. | Seção 5b abaixo; violações V1/V2/V3/V5/V9 fechadas na seção 2; V7/V8 fechados como efeito colateral de tocar os mesmos arquivos |
| 2026-09-09 | Segunda funcionalidade de CRUD completo (rubrica 1.2) decidida: **Tutor, escopado a "Meu Perfil"** — nunca uma tela de buscar/operar tutor por ID arbitrário. Consulta/Teleconsulta fica fora da Sprint 3 (confirma o item 4 de `docs/PEDIDO_BACKEND.md`: sem `GET /api/veterinarios`, o app segue só com Pet + Perfil do Tutor). Implementado: `src/api/tutores.ts`, `src/hooks/useTutores.ts` (`useTutor`/`useAtualizarTutor`/`useExcluirTutor`), `ConfiguracoesScreen.tsx` (Read completo + entradas para editar/excluir) e `EditarPerfilScreen.tsx` (Update, novo). | Risco de dependência externa (backend `java-advanced`) alto demais para os 3 dias restantes até 12/09; Tutor já tinha CRUD 100% disponível na API e já era o fallback documentado desde 02/09. | `docs/AUDITORIA.md` seção 3, `docs/PEDIDO_BACKEND.md` item 4 |
| 2026-09-09 | CRUD completo de **Pet** implementado e acessível pela interface: `src/api/pets.ts` (camada de acesso a dados, nova) → `src/hooks/usePets.ts` (`usePets`/`usePet`/`useCriarPet`/`useAtualizarPet`/`useExcluirPet`) → `PetsListScreen.tsx`/`PetDetalheScreen.tsx`/`EditarPetScreen.tsx` (novas) + `CadastroPet.tsx` (revisado). Formulário de nome/espécie/raça/sexo/nascimento extraído para `src/components/FormularioPet.tsx` (primeiro componente reutilizável do projeto), compartilhado por Create e Update. | Fecha o requisito de CRUD completo (rubrica 1.2) para a primeira das duas funcionalidades escolhidas (Pet/Tutor, ver seção 3); evita duplicar validação de formulário entre Create e Update. | `docs/AUDITORIA.md` seção 3, `src/api/pets.ts`, `src/hooks/usePets.ts`, `src/components/FormularioPet.tsx` |
| 2026-09-09 | Fluxo de autenticação (cadastro → login automático → sessão persistida → Home) verificado manualmente pelo usuário em device físico real via Expo Go, contra a API Java na rede local. Logs de diagnóstico temporários do interceptor axios (`src/api/client.ts`) removidos — mantido só o tratamento de erro permanente na UI (`erro`/`formErro` em `Login.tsx`/`Cadastro.tsx`). | V9 (rubrica, penalidade X) fechada com verificação real, não só `tsc`/`lint`; os logs cumpriram o propósito de diagnóstico e não devem seguir para a entrega final. | `docs/AUDITORIA.md` seção 2 (V9), `src/api/client.ts` |
| 2026-09-09 | Base URL da API deixa de ser um valor estático em `app.json` (versionado) e passa a vir de `KURAVET_API_BASE_URL`, lida de `.env.local` (gitignorado) por `app.config.ts` — `app.json` removido. Adicionado `expo-build-properties` (`android.usesCleartextTraffic: true`) para permitir HTTP em claro contra a API local em builds nativos/dev client (Android bloqueia por padrão a partir do target SDK do Expo 57; não afeta o Expo Go da Play Store, que usa manifest próprio — ver `docs/RODANDO_LOCAL.md`). | Testar contra a API Java na rede local (`http://192.168.0.83:8080/api`, confirmado acessível via `/ping`) sem comitar IP de rede pessoal em arquivo versionado. | `app.config.ts`, `.env.example`, `docs/RODANDO_LOCAL.md`, `README.md` seção "Base URL por ambiente" |
| 2026-09-10 | **Manter as rotas `Teleconsulta` e `HistoricoDiagnostico` (não remover), com plano de convertê-las em EmptyState honesto antes da gravação do vídeo — redesign ainda não executado.** O app já tem **10 telas com funcionalidade real** sem contar os dois stubs (Login, Cadastro, Home, CadastroPet, PetsList, PetDetalhe, EditarPet, EditarPerfil, Perfil, Configuracoes) — bem acima do mínimo de 6 da rubrica (seção 1.1), então remover os stubs não muda esse critério. Remover as rotas, por outro lado, quebraria `QUICK_ACTIONS` em `Home.tsx` (as ações "Nova Consulta" e "Histórico" navegam para exatamente essas duas rotas) e apagaria do app o contexto de produto do briefing CLYVO VET (continuidade terapêutica/histórico), sem necessidade — a decisão de escopo já registrada em 2026-09-09 (Teleconsulta fora da Sprint 3) continua sendo sobre não implementar Create de consulta, não sobre esconder a existência do recurso. | `docs/RUBRICA.md` seção 1.1, `README.md` (kuravet-app) seção "O que ainda não está implementado" |
| 2026-09-03 | **Alvo da entrega é nativo (Android/iOS, emulador ou device físico); web é só conveniência de desenvolvimento, nunca o ambiente de verificação.** Armazenamento de credenciais isolado atrás de uma interface (`src/auth/secureStorage.ts`), com implementação por plataforma resolvida pelo Metro: nativo continua 100% `expo-secure-store` (sem mudança de comportamento); web usa `src/auth/secureStorage.web.ts`, um fallback só de desenvolvimento sobre `localStorage` (não é armazenamento seguro), que avisa alto no console toda vez que é acionado, para nunca passar despercebido como equivalente ao Keychain/Keystore nativos. | `expo-secure-store` não tem implementação web — `ExpoSecureStore.getValueWithKeyAsync is not a function` ao rodar `expo start --web`, reportado pelo usuário. A rubrica da Sprint 3 pede demonstração em smartphone/emulador, então corrigir para viabilizar web silenciosamente (ex.: sempre `localStorage`, sem isolar por plataforma) esconderia que a entrega real roda em outro código-caminho do que o ambiente mais conveniente de desenvolver. | `src/auth/secureStorage.ts`, `src/auth/secureStorage.web.ts`, `README.md` (seção "Plataforma alvo") |

## 2. Violações conhecidas das regras invioláveis (código atual)

| # | Regra (`CLAUDE.md`) | Onde | Descrição | Status |
|---|---|---|---|---|
| V1 | 1 — zero dados mockados | `src/screens/Home.tsx`, `CONSULTAS_FALLBACK` | Array fixo de consultas exibido quando a API retorna vazio/erro | **Resolvido (Fase 2)** — removido; lista vazia agora renderiza um estado vazio real ("Você ainda não tem consultas..."), não dado fixo |
| V2 | 2 — zero fetch em componente de tela | `src/screens/Home.tsx`, função `fetchConsultas` | Definida dentro do arquivo de tela, não em hook isolado | **Resolvido (Fase 2)** — movida para `src/hooks/useConsultas.ts`; `Home.tsx` só chama `useConsultas()` |
| V3 | 2 — zero fetch em componente de tela | `src/screens/CadastroPet.tsx`, função `fetchTutores` | Definida dentro do arquivo de tela, não em hook isolado | **Resolvido (Fase 2)**, com mudança de abordagem: `fetchTutores` foi movida para `src/hooks/useTutores.ts`, mas `CadastroPet.tsx` **não usa mais esse hook** — o dono do pet agora vem direto de `useAuth().usuario.idTutor` (de `GET /api/auth/me`), sem precisar buscar a lista completa de tutores só para achar o próprio registro por e-mail. Isso também reduz a exposição do gap de PII de `GET /api/tutores` (seção 3, nota sobre `GET /api/tutores`) — o app deixou de chamar esse endpoint no fluxo de cadastro de pet. `useTutores` fica disponível para uma futura tela de gestão de tutores (perfil VETERINARIO). A mutation `POST /pets` também foi movida para `src/hooks/usePets.ts` (`useCriarPet`) — não estava numerada como violação, mas era a mesma classe de problema (`api.post` direto dentro de `CadastroPet.tsx`) |
| V4 | 3 — navegação só por rotas declaradas | `src/routes/index.tsx` | `RootNavigator` escolhe `AuthStackNavigator`/`AppStackNavigator` a partir de `useAuth().status` | **Resolvido (Fase 2)** — mecanismo pronto desde a Fase 1, efeito prático fechado agora que `Login.tsx`/`Cadastro.tsx` alimentam `status` via `useAuth()` (ver V9) |
| V5 | 4 — autenticação real com persistência, direto na API Java | `Login.tsx`, `Cadastro.tsx`, `PerfilScreen.tsx`, `ConfiguracoesScreen.tsx` | Firebase removido por completo (`package.json`, `src/config/firebaseConfig.ts`, `src/utils/firebaseErrorMessage.ts`, todo `import ... from 'firebase/*'`). As quatro telas usam `useAuth()` (`login`, `cadastro`, `logout`, `usuario`) — fonte única de identidade é a API Java, sessão persistida em `expo-secure-store` (Fase 1) | **Resolvido (Fase 2)** |
| V6 | integração real (rubrica 1.2, penalidade VI) | `src/api/client.ts` | Interceptor assina toda requisição com `Authorization: Basic ...` a partir do `expo-secure-store`, quando há sessão salva | **Resolvido (Fase 1)**, validado de ponta a ponta na Fase 2 (`Login`→`Home`→`CadastroPet`→`logout` contra a API real) |
| V6b | — | `src/api/client.ts`, `BASE_URL` | Hardcoded para IP local de desenvolvimento (`192.168.56.1`) | **Resolvido (Fase 1, endurecido 2026-09-09)** — configurável via `app.config.ts` > `expo.extra.apiBaseUrl`, lida de `KURAVET_API_BASE_URL` em `.env.local` (gitignorado, nunca em arquivo versionado); o valor hardcoded virou só o fallback |
| V7 | convenção "sem emojis" (interface e documentação) | `src/screens/CadastroPet.tsx`, toggle de espécie | Usava emoji (🐶/🐱) como ícone da opção Cachorro/Gato | **Resolvido (Fase 2)** — removido ao tocar o arquivo para eliminar o Firebase; toggle agora só texto ("Cachorro"/"Gato"), sem redesign |
| V8 | qualidade de código (não é uma das 6 regras invioláveis, mas pontua na rubrica) | `src/screens/PerfilScreen.tsx:39`, `src/screens/ConfiguracoesScreen.tsx:27` | `npx expo lint` acusava `react-hooks/set-state-in-effect` (erro) nas duas telas — `setState` síncrono dentro de `useEffect` sem guarda, usado para copiar `auth.currentUser` do Firebase para estado local | **Resolvido (Fase 2)** — como efeito colateral de trocar `auth.currentUser` por `useAuth().usuario`: os dados agora vêm direto do contexto (`useMemo`/derivação simples), sem `useEffect`+`setState`. `npx expo lint` limpo (0 erros) |
| V9 | app precisa executar corretamente (rubrica, penalidade X) | `src/routes/index.tsx` (guard) × `src/screens/Login.tsx`/`Cadastro.tsx` | O guard decide a árvore de navegação pelo `AuthContext` (`status`); `Login.tsx` chama `useAuth().login(...)`, `Cadastro.tsx` chama `useAuth().cadastro(...)` (que internamente cria a conta via `POST /api/auth/cadastro` e reaproveita `login`). Nenhuma das duas telas navega manualmente para `Home` — `RootNavigator` troca de stack sozinho quando `status` vira `'autenticado'` | **Resolvido e verificado (2026-09-09)** — `npx tsc --noEmit`/`npx expo lint` limpos **e** fluxo completo confirmado pelo usuário em device físico real via Expo Go, contra a API Java na rede local: cadastro → login automático → sessão persistida (fechar/reabrir o app não pede login de novo) → Home. Fecha a "Verificação manual pendente" da seção 5b abaixo |

## 3. CRUD por entidade — o que é viável hoje

Análise completa (2026-09-02) dos endpoints reais em `docs/API_CONTRACT.md` cruzados com o
requisito de rubrica "CRUD completo integrado à interface" (`docs/RUBRICA.md` seção 1.2).

### Pet — [COMPLETO] CRUD integrado à interface (2026-09-09)

| Operação | Endpoint | Tela | Observação |
|---|---|---|---|
| Create | `POST /api/pets` | `CadastroPet.tsx` | Dono é sempre o tutor autenticado (não vem do corpo) |
| Read (lista) | `GET /api/pets` | `PetsListScreen.tsx` | Tutor só vê os próprios |
| Read (detalhe) | `GET /api/pets/{id}` | `PetDetalheScreen.tsx` | 404 se não existir/não for do tutor |
| Update | `PUT /api/pets/{id}` | `EditarPetScreen.tsx` | Reaproveita `FormularioPet` (mesma validação do Create) |
| Delete | `DELETE /api/pets/{id}` | `PetDetalheScreen.tsx` (confirmação via `Alert.alert`) | Bloqueado (400) se o pet tiver consultas — mensagem do backend exibida via `getApiErrorMessage`, sem tratamento especial no app |

Escopo por dono já resolvido no backend (`PetService`). **Funcionalidade 1 do CRUD completo da
rubrica (seção 1.2) — fechada.** Arquitetura: `src/api/pets.ts` (funções tipadas) →
`src/hooks/usePets.ts` (`usePets`/`usePet`/`useCriarPet`/`useAtualizarPet`/`useExcluirPet`,
invalidação de `['pets']` após toda mutation) → telas (`CadastroPet`, `PetsListScreen`,
`PetDetalheScreen`, `EditarPetScreen`), todas só apresentação. Verificado: `npx tsc --noEmit` e
`npx expo lint` limpos; `grep` de `apiClient\.`/`axios\.` em `src/screens/**` sem resultado.
**Verificação manual em device físico real ainda pendente** (só a Fase de autenticação foi
validada assim até aqui, ver V9 na seção 2) — rodar o roteiro completo de Pet
(criar → listar → abrir detalhe → editar → excluir) contra a API local antes de considerar esta
fatia fechada para a entrega.

### Tutor ("Meu Perfil") — [COMPLETO] CRUD integrado à interface, escopado ao próprio tutor (2026-09-09)

| Operação | Endpoint | Tela | Observação |
|---|---|---|---|
| Create | `POST /api/auth/cadastro` (implementado — ver seção 4, item 1) | `Cadastro.tsx` | Cadastro + login (Tutor + Usuario) via `useAuth().cadastro()`, Fase 2 |
| Read | `GET /api/tutores/{idTutor}` | `ConfiguracoesScreen.tsx` | Campos completos (CPF/telefone/e-mail/endereço/dataCadastro) — `GET /api/auth/me` só devolve `idTutor`/`nomeTutor` |
| Update | `PUT /api/tutores/{idTutor}` | `EditarPerfilScreen.tsx` | Formulário próprio (não compartilhado com Create — campos e fluxo diferentes) |
| Delete | `DELETE /api/tutores/{idTutor}` | `ConfiguracoesScreen.tsx` (confirmação via `Alert.alert`) | Encadeia `logout()` em `onSuccess` — sessão local encerrada mesmo se o backend não cascatear a exclusão do `USUARIO` associado (não confirmado, ver nota abaixo) |

`TutorController` **ainda não verifica dono** no backend — qualquer autenticado pode ler, atualizar
ou excluir **qualquer** `idTutor`, não só o próprio (`docs/API_CONTRACT.md`, `docs/PEDIDO_BACKEND.md`
item 3, ainda pendente de correção no backend). Mitigação client-side, agora completa: **nenhuma
tela do app aceita um `idTutor` vindo de navegação, param de rota ou input do usuário** —
`ConfiguracoesScreen.tsx` e `EditarPerfilScreen.tsx` só operam com `useAuth().usuario.idTutor`
(vindo de `GET /api/auth/me`); `EditarPerfil` é uma rota sem parâmetro (ver
`src/routes/index.tsx`). Isso reduz a exposição pelo próprio app a zero, mas não corrige a falta
de proteção no backend, que continua acessível a qualquer cliente HTTP (Postman, curl, outro app).

[GAP NÃO VERIFICADO] `DELETE /api/tutores/{id}` — não confirmado se o backend cascateia a exclusão
do `USUARIO` associado ao excluir o `Tutor`. Se não cascatear, a linha de login pode continuar
existindo no banco (órfã) mesmo depois do tutor "excluir a conta" pelo app — não é um problema
visível para o usuário (o app já limpa `expo-secure-store` e encerra a sessão local via `logout()`
independente do que o backend fizer), mas é um dado inconsistente no banco que vale reportar ao
time do `java-advanced` se sobrar tempo depois da Sprint 3.

**Funcionalidade 2 do CRUD completo da rubrica (seção 1.2) — fechada.** Arquitetura: `src/api/tutores.ts`
(funções tipadas, com aviso de dono) → `src/hooks/useTutores.ts` (`useTutores`/`useTutor`/
`useAtualizarTutor`/`useExcluirTutor`, invalidação de `['tutores']`) → telas
(`ConfiguracoesScreen.tsx` reescrita, `EditarPerfilScreen.tsx` nova), só apresentação. Verificado:
`npx tsc --noEmit` e `npx expo lint` limpos; `grep` de `apiClient\.`/`axios\.` em `src/screens/**`
sem resultado. **Verificação manual em device físico real ainda pendente** para esta fatia
especificamente (Read/Update/Delete de perfil) — o roteiro de Pet já foi validado assim, este
ainda não.

### Consulta/Teleconsulta — [BLOQUEADO] para Create

| Operação | Endpoint | Observação |
|---|---|---|
| Create | `POST /api/consultas/solicitacoes` | Exige `idVeterinario` válido — **sem `GET /api/veterinarios`, não há forma real de escolher um** |
| Read | `GET /api/consultas`, `GET /api/consultas/{id}` | Funciona |
| Update | `PUT /api/consultas/{id}` | Funciona, só enquanto `SOLICITADA`/`AGENDADA` |
| Delete | `DELETE /api/consultas/{id}` | Funciona |

Read/Update/Delete são operáveis, mas sem Create real a funcionalidade não fecha um CRUD completo
sem violar a regra de zero dados mockados. **Não escolhida agora.** Se o backend expuser
`GET /api/veterinarios` a tempo, promover para funcionalidade 3 (reforça diretamente o critério
"aderência ao problema" do briefing da CLYVO VET, que é sobre teleconsulta/continuidade).

**Estado da tela (`TeleconsultaScreen.tsx`):** stub — só título, sem nenhuma operação real,
mesmo com Read/Update/Delete tecnicamente disponíveis na API (não implementados na UI porque a
funcionalidade só foi escolhida para CRUD completo se viesse com Create real, ver decisão de
2026-09-02 acima). Decisão de 2026-09-10: manter a rota e a entrada em "Ações Rápidas" (`Home.tsx`)
em vez de remover — ver seção 1.

### Histórico de Diagnóstico — [FORA DE ESCOPO] sem endpoint no backend

Diferente de Teleconsulta, não existe hoje nenhum endpoint na API Java para histórico de
diagnóstico — não está em `docs/API_CONTRACT.md` nem foi pedido em `docs/PEDIDO_BACKEND.md`. Não é
um caso de "Create bloqueado, Read liberado" como Teleconsulta: é uma funcionalidade ainda não
modelada em nenhuma camada (backend, contrato, app). `HistoricoDiagnosticoScreen.tsx` é um stub
(só título) pelo mesmo motivo. Decisão de 2026-09-10: manter a rota e a entrada em "Ações Rápidas"
(`Home.tsx`) — ver seção 1.

## 4. Gaps de backend pedidos (java-advanced) — status

Pedido formal e autocontido para o time de backend em `docs/PEDIDO_BACKEND.md` — este documento
aqui é o rastreamento vivo do mesmo pedido, atualizado conforme o status muda.

### Bloqueantes

Os três itens abaixo estão no mesmo nível de prioridade. Nenhum é "menos crítico" que o outro:
os dois primeiros bloqueiam o app conseguir autenticar de qualquer forma contra a API real; o
terceiro é uma falha de controle de acesso já explorável hoje contra a API em produção/homologação,
independentemente de o app mobile chegar a usá-la.

| # | Item | Bloqueia | Status |
|---|---|---|---|
| 1 | `POST /api/auth/cadastro` (contrato em `docs/API_CONTRACT.md`) | Cadastro real de tutor com login | **Implementado** — confirmado em 2026-09-03, consumido por `useAuth().cadastro()` na Fase 2 |
| 2 | `GET /api/auth/me` (contrato em `docs/API_CONTRACT.md`) | Validar login e obter perfil (`idTutor`/`perfil`) | **Implementado** — confirmado em 2026-09-03, consumido por `useAuth()` desde a Fase 1 (bootstrap + `login`), agora com efeito de ponta a ponta na Fase 2 |
| 3 | Correção de ownership em `TutorController` | Controle de acesso por dono/perfil (qualquer autenticado lê/edita/exclui tutor de terceiros) | Aguardando backend |

**Item 3 — comportamento esperado da correção:** hoje `buscarPorId`, `atualizar` e `excluir` em
`TutorController`/`TutorService` recebem um `id` de `@PathVariable` e operam sobre ele sem checar
quem está autenticado. O padrão já usado em `PetService.buscarPorId` e
`ConsultaService.buscarPorId` deve ser replicado aqui: o método precisa receber
`@AuthenticationPrincipal UsuarioPrincipal principal` e, quando `principal.isTutor()` for
verdadeiro, validar que `principal.getIdTutor()` é igual ao `id` do path — caso contrário, lançar
`TutorNaoEncontradoException` (**404**, não 403, seguindo o mesmo raciocínio já aplicado a Pet e
Consulta: não revelar a existência de registros de terceiros). Para `perfil == VETERINARIO`, o
acesso a qualquer tutor continua liberado, pois o portal web precisa gerenciar todos os tutores.
`GET /api/tutores` (listagem) tem o mesmo problema em menor grau — hoje devolve todos os tutores
para qualquer autenticado; idealmente deveria devolver lista vazia/só o próprio registro para
`TUTOR`, e lista completa só para `VETERINARIO`.

### Não bloqueante

| # | Item | Bloqueia | Status | Alternativa se não vier |
|---|---|---|---|---|
| 4 | `GET /api/veterinarios` | Create de Consulta/Teleconsulta (funcionalidade 3, opcional) | Aguardando backend | Mobile segue só com Pet + Tutor (funcionalidades 1 e 2); Teleconsulta fica de fora da Sprint 3 |

## 5. Fase 1 (Fundação) — o que foi entregue

Executada em 2026-09-02. Escopo: só camadas de base, nenhuma tela de feature nova.

- `src/types/` — `pet.ts`, `tutor.ts`, `consulta.ts`, `auth.ts`, `apiError.ts` + barrel
  `index.ts`, espelhando os DTOs reais de `docs/API_CONTRACT.md` (os de `auth.ts` espelham o
  contrato *proposto*, ainda não confirmado pelo backend).
- `src/api/client.ts` — substitui `src/services/api.ts` (removido). Mesma instância axios de
  antes (timeout 60s), agora com: (a) `baseURL` configurável via `app.json` >
  `expo.extra.apiBaseUrl`, e (b) interceptor de requisição que assina `Authorization: Basic ...`
  a partir das credenciais no `expo-secure-store`, quando existirem.
- `src/auth/secureCredentials.ts` — salvar/ler/limpar credenciais no `expo-secure-store` (nunca
  `AsyncStorage`) e montar o header Basic (`src/utils/base64.ts`, sem depender de `btoa`/`Buffer`).
- `src/auth/AuthContext.tsx` — `AuthProvider`/`useAuth()`: reidrata sessão no boot chamando
  `GET /api/auth/me` (endpoint proposto, ainda não existe — falha vira "sem sessão", não crash);
  `login(username, senha)` valida contra o mesmo endpoint antes de persistir; `logout()` limpa a
  sessão.
- `src/routes/index.tsx` — `RootNavigator` agora escolhe entre `AuthStackNavigator`
  (Login/Cadastro) e `AppStackNavigator` (as 6 telas restantes) a partir de `useAuth().status`,
  com uma tela de loading enquanto a sessão é reidratada. `RootStackParamList` mantido idêntico
  para nenhuma tela precisar mudar sua tipagem de navegação.
- `App.tsx` — envolvido com `AuthProvider`.
- `package.json`/`app.json` — `expo-secure-store` instalado (`~57.0.3`), plugin registrado
  automaticamente pelo `expo install`; `expo.extra.apiBaseUrl` adicionado.
- Verificação: `npx tsc --noEmit` limpo. `npx expo lint` sem novos erros/warnings introduzidos por
  este trabalho (os 2 erros e a maioria dos warnings encontrados são pré-existentes, em arquivos
  não tocados nesta fase — ver V8; os warnings de import do axios em `client.ts`/`AuthContext.tsx`
  seguem o mesmo padrão já usado em `src/utils/apiErrorMessage.ts`).

**Consequência que precisa de atenção antes de qualquer demo:** ver V9 na seção 2. O app não
alcança a Home pelo fluxo de login atual até a Fase 2 rewirar `Login.tsx`/`Cadastro.tsx`.

## 5b. Fase 2 (Auth real + fim do Firebase) — o que foi entregue

Executada em 2026-09-03. Pré-condição confirmada pelo usuário no início da fase: o backend
(`java-advanced`) já implementa `POST /api/auth/cadastro` e `GET /api/auth/me` (itens 1/2 de
`docs/PEDIDO_BACKEND.md`) — os dois endpoints deixam de ser tratados como "proposto" nesta
auditoria e em `docs/API_CONTRACT.md`.

- **Firebase removido por completo**: `firebase` fora de `package.json`/`package-lock.json` (66
  pacotes a menos via `npm install`), `src/config/firebaseConfig.ts` e `src/utils/
  firebaseErrorMessage.ts` deletados, nenhum `import ... from 'firebase/*'` restante no repositório
  (`grep -ri firebase` limpo fora de `node_modules`/histórico do git).
- **`src/auth/AuthContext.tsx`** — adicionado `cadastro(dados: CadastroInput)`: chama
  `POST /api/auth/cadastro` e, em caso de sucesso, reaproveita `login()` com as mesmas credenciais
  (garante que cadastro só é considerado concluído com a sessão validada e persistida, mesmo
  contrato de `login()`). Erros da API tratados via `getApiErrorMessage` (ver próximo item).
- **`src/utils/apiErrorMessage.ts` corrigido**: a versão da Fase 1 procurava `data?.message`/
  `data?.error`, mas o `ApiExceptionHandler` real devolve `mensagem` (não `message`) e, em erro de
  validação de campo, um objeto `campos` (ver `docs/API_CONTRACT.md`, seção Erros) — nenhum dos
  dois era lido antes. Agora prioriza `campos` (junta as mensagens de cada campo inválido) e depois
  `mensagem`. Isto não é um item novo da rubrica, é a correção de um bug que teria feito toda
  mensagem de erro da API cair no fallback genérico.
- **`src/screens/Login.tsx`** reescrita: campo `email` virou `username` (a API autentica por
  username/senha via HTTP Basic, não e-mail — ver `docs/API_CONTRACT.md`), chama
  `useAuth().login()`, indicador de carregamento mantido, erro de validação inline (`formErro`),
  erro da API em `Alert.alert` com a mensagem de `AuthContext.login()`. Sem `navigation.reset`: a
  troca de stack é 100% pelo guard (`RootNavigator` reagindo a `status`).
- **`src/screens/Cadastro.tsx`** reescrita: formulário agora cobre o `CadastroInput` real (nome,
  CPF, e-mail opcional, telefone opcional, username, senha, confirmar senha) em vez dos três campos
  do fluxo Firebase (nome, e-mail, senha). Validação de formulário: campos obrigatórios, CPF com 11
  dígitos, e-mail com formato válido quando preenchido, senha com 6+ caracteres, confirmação de
  senha. Chama `useAuth().cadastro()`; mesmo padrão de erro/loading/sem-`navigation.reset` de
  `Login.tsx`.
- **`src/screens/CadastroPet.tsx`**: removido o "match silencioso" por e-mail do Firebase contra
  `GET /api/tutores` — agora usa `useAuth().usuario.idTutor` diretamente (ver V3 na seção 2, inclui
  a mudança de abordagem). Campo `peso` removido do formulário: não existe em `PetRequestDTO`
  (`docs/API_CONTRACT.md`) — o formulário anterior enviava um campo que a API real não documenta.
  Adicionada validação de que a data de nascimento está no passado (a API valida com `@Past` e
  devolveria 400). Mutation `POST /pets` movida para `src/hooks/usePets.ts`.
- **`src/screens/PerfilScreen.tsx` / `ConfiguracoesScreen.tsx`**: `auth.currentUser`/`signOut` do
  Firebase trocados por `useAuth().usuario`/`useAuth().logout()`. Como efeito colateral, o
  `useEffect`+`setState` usado para copiar `auth.currentUser` para estado local desapareceu (dado
  vem direto do contexto) — fecha V8 (ver seção 2). `ConfiguracoesScreen.tsx` mostra usuário/perfil
  em vez de "e-mail de acesso" (a API não tem esse conceito — autenticação é HTTP Basic por
  username/senha).
- **`src/hooks/`** criado — `useConsultas.ts` (`GET /consultas`, usado por `Home.tsx`),
  `useTutores.ts` (`GET /tutores`, hoje sem consumidor — ver V3), `usePets.ts` (`useCriarPet`,
  `POST /pets`, usado por `CadastroPet.tsx`). Nenhum `api.get`/`api.post` restante dentro de
  `src/screens/**` (`grep` de `apiClient\.` / `api\.(get|post|put|patch|delete)` em
  `src/screens/` sem resultado).
- **`src/screens/Home.tsx`**: `CONSULTAS_FALLBACK` removido; `ConsultaCard`/`StatusBadge` agora
  tipados com `Consulta`/`StatusConsulta` reais (antes usavam `any` e rótulos em português que não
  correspondiam aos valores reais do enum — `Agendada`/`Confirmada`/`Concluída` viravam
  `SOLICITADA`/`AGENDADA`/`REALIZADA`/`CANCELADA`/`RECUSADA`). Lista vazia (sem erro, sem consultas)
  agora mostra um estado vazio real, não dado mockado.
- Verificação: `npx tsc --noEmit` limpo. `npx expo lint` limpo (0 erros; restam só 3 warnings
  pré-existentes de `import/no-named-as-default-member` do axios, mesmo padrão já documentado na
  Fase 1).

**[RESOLVIDO em 2026-09-09]** Verificação manual do fluxo completo cadastro → login → sessão
persistida → Home, confirmada pelo usuário em device físico real via Expo Go, contra a API Java
rodando na rede local (`docs/RODANDO_LOCAL.md`) — ver V9 na seção 2. Logout isolado (Perfil →
"Sair da Conta" → volta ao Login) ainda não teve confirmação explícita nesta rodada de teste.

## 5c. Plataforma alvo: nativo, não web (correção pós-Fase 2, 2026-09-03)

Ao tentar a verificação manual do item acima em `expo start --web`, a reidratação de sessão em
`AuthContext.tsx` derrubava com `ExpoSecureStore.getValueWithKeyAsync is not a function` — o
módulo nativo `expo-secure-store` não tem implementação para web (limitação documentada do próprio
pacote, não um bug do app).

**Decisão** (registrada na seção 1): o alvo real da entrega é nativo — Android/iOS, emulador ou
device físico, como a própria rubrica da Sprint 3 pede. Web nunca foi o ambiente de verificação,
só uma conveniência de desenvolvimento (preview rápido de UI sem abrir um emulador) — e não deve
virar um segundo ambiente de auth com comportamento de segurança diferente e silencioso.

**O que foi feito:**

- `src/auth/secureStorage.ts` — interface `getItem`/`setItem`/`removeItem`, implementação nativa
  (Android/iOS) sobre `expo-secure-store`, mesmo comportamento de antes da separação.
- `src/auth/secureStorage.web.ts` — mesma interface, fallback **só de desenvolvimento** sobre
  `localStorage`. `localStorage` não é armazenamento seguro (texto plano, legível por qualquer
  script na mesma origem) — por isso toda chamada emite `console.warn` avisando que é um fallback
  não seguro e que o alvo real é nativo. O Metro escolhe automaticamente qual dos dois arquivos
  entra no bundle pela extensão de plataforma (`*.web.ts` para web, `*.ts` genérico como padrão
  para as demais) — nenhum código em `src/auth/secureCredentials.ts` ou `src/auth/AuthContext.tsx`
  precisou mudar para saber qual está rodando.
- `src/auth/secureCredentials.ts` — trocou o import direto de `expo-secure-store` pela interface
  `secureStorage`; mesma API pública (`salvarCredenciais`/`obterCredenciais`/`limparCredenciais`),
  nenhum consumidor (`AuthContext.tsx`) precisou mudar.
- `README.md` — nova seção "Plataforma alvo" explicando a mesma decisão para quem for rodar o
  projeto (ver seção 6, "como rodar em emulador Android").
- Verificação: `npx tsc --noEmit` e `npx expo lint` limpos (mesmos 3 warnings pré-existentes de
  `import/no-named-as-default-member` do axios).

## 5d. Cadastro travando em loading no Expo Web, sem mensagem de erro (investigação, 2026-09-08)

Reportado pelo usuário: em `expo start --web`, `CADASTRAR` entra em loading e volta sem nenhum
feedback — nenhum usuário é criado. Investigação nesta ordem: causa raiz confirmada primeiro,
hipóteses de rede/contrato depois (não foi possível reproduzir ponta a ponta contra a API Java
real nesta sessão — sem o repositório `java-advanced` neste workspace nem um backend rodando para
testar contra ele).

**Causa raiz confirmada — engolimento silencioso do erro:** `Alert.alert` do `react-native-web`
0.21 (`node_modules/react-native-web/dist/exports/Alert/index.js`) é `static alert() {}` — um
no-op completo no navegador, sem nenhum diálogo. `Cadastro.tsx`/`Login.tsx` só reportavam falha via
`Alert.alert(...)`, então qualquer erro (rede, timeout, resposta 4xx/5xx da API) desaparecia sem
rastro no Expo Web: o botão só saía do `isLoading` no `finally`, como se nada tivesse acontecido.
Reproduz para qualquer causa de falha, não só as investigadas abaixo — é a explicação completa do
sintoma relatado ("volta sem mensagem de erro").

**[RESOLVIDO]** `Cadastro.tsx` e `Login.tsx`: erro agora também vai para `erro`/`formErro` (texto
inline, sempre visível, todas as plataformas — tratamento permanente, não temporário), mantendo
`Alert.alert` para iOS/Android (funciona normalmente lá). `src/api/client.ts`: timeout explícito
reduzido de 60s para 20s (permanente). O interceptor de resposta com log em `__DEV__` era
diagnóstico temporário para esta investigação — **removido em 2026-09-09** (V9 verificada de
ponta a ponta em device real, ver seção 2), junto com o log de `baseURL` resolvida citado no item 1
abaixo.

**Investigação da causa de rede/API — atualizada em 2026-09-08 (correção de curso: as duas
questões abaixo estavam misturadas numa única "hipótese mais provável"; são independentes, com
status e ação bem diferentes, e não devem ser tratadas como uma coisa só):**

1. **[RESOLVIDO — correção de ambiente, não de código]** `BASE_URL` estava fixa em
   `http://192.168.56.1:8080/api`, o adaptador Host-Only do VirtualBox — um IP que só existe
   naquela máquina/rede específica, não um valor de projeto válido para qualquer ambiente. Trocado
   para `http://localhost:8080/api` (hoje via `app.config.ts` > `expo.extra.apiBaseUrl`, ver
   decisão de 2026-09-09 na seção 1), correto para Expo Web na mesma máquina que roda a API Java.
   **Este valor não serve para emulador Android nem device físico** — ver `README.md`, seção
   "Base URL por ambiente", para a tabela completa (`10.0.2.2` para emulador, IP de rede local para
   device físico via Expo Go) e `docs/RODANDO_LOCAL.md` para o passo a passo. O log temporário de
   `baseURL` em `client.ts` foi removido em 2026-09-09, junto com o de falha de requisição (ver
   nota acima) — a causa deste item já está confirmada e fechada.

2. **[PENDENTE DE CONFIRMAÇÃO — não acionar o backend ainda]** CORS/preflight no Spring Security:
   hipótese de que o `CorsConfigurationSource` de `CorsConfig.java` (descrito em
   `docs/API_CONTRACT.md` como permissivo para `/api/**`) não esteja também registrado no
   `SecurityFilterChain`, fazendo o Spring Security barrar o preflight `OPTIONS` (sem
   `Authorization`, por definição de CORS) antes de a camada MVC aplicar CORS — padrão clássico que
   só se manifesta em navegador, nunca em Android/iOS nativo. **Isto é só uma hipótese, não
   verificada contra o código-fonte real do `java-advanced`** (fora deste repositório, sem acesso
   nesta sessão). CORS por definição só afeta o navegador — que não é o ambiente de entrega da
   Sprint 3 (ver seção 5c, "Plataforma alvo: nativo, não web") — então **não vamos pedir nenhuma
   mudança no Spring por causa disso** enquanto não confirmarmos, rodando de fato no browser com a
   correção de baseURL acima já aplicada, que o erro observado é mesmo de CORS (`error.code` tipo
   `ERR_NETWORK`/sem `error.response`, e uma mensagem de CORS explícita no console do navegador —
   os logs temporários de `client.ts` mostram isso). Não mexer no Spring Security de graça por um
   ambiente que não é entregável.

3. **[CONFIRMADO — item real e independente de CORS, registrado em `docs/PEDIDO_BACKEND.md` item
   5]** `POST /api/auth/cadastro` provavelmente exige `Authorization: Basic` como qualquer outra
   rota — `docs/API_CONTRACT.md` afirma "único endpoint público: `GET /api/ping`", o que inclui
   `/auth/cadastro`. Isso não é uma hipótese de ambiente, é uma contradição lógica: um tutor novo,
   por definição, ainda não tem username/senha válidos no banco para montar o header Basic da
   própria chamada de cadastro — e o app (`src/auth/AuthContext.tsx`, `cadastro()`) de fato não
   envia nenhum `Authorization` nessa chamada (não há credencial salva ainda). Se o backend exige
   auth nessa rota, **todo** cadastro de tutor novo falha com `401`, em qualquer plataforma —
   native incluído — nunca só no browser. Isso também explica por que a "Verificação manual
   pendente" registrada na Fase 2 (seção 5b) nunca foi de fato fechada: o fluxo cadastro→login
   nunca rodou com sucesso ponta a ponta contra o backend real, só teve a implementação dos
   endpoints confirmada pelo time do backend por fora. Correção pedida: **apenas**
   `POST /api/auth/cadastro` passa a ser público na camada de autenticação (`permitAll` só nessa
   rota); todo o resto da cadeia de segurança (Basic Auth em todo o resto, checagem de perfil
   `TUTOR`/`VETERINARIO`, escopo por dono em Pet/Consulta) permanece exatamente como está. Ver
   detalhamento em `docs/PEDIDO_BACKEND.md`.

4. Contrato: `CadastroInput` (`src/types/auth.ts`) enviado por `Cadastro.tsx` (`nome`, `cpf`,
   `telefone?`, `email?`, `username`, `senha`) confere campo a campo com `TutorRequestDTO`
   documentado em `docs/API_CONTRACT.md` (`endereco` fica de fora por não ter campo no formulário,
   mas é opcional no contrato) — **sem divergência encontrada**, `docs/API_CONTRACT.md` não
   precisou de atualização quanto a isto.

**Próximo passo:** reproduzir com a `baseURL` corrigida (item 1) e com o console do navegador
aberto — os logs temporários de `client.ts` mostram a `baseURL` resolvida e, em caso de falha,
`status`/`code`/corpo da resposta (quando existir). Um `401` sem corpo de `ApiExceptionHandler`
(formato padrão do Spring Security) na primeira chamada de um cadastro novo confirma o item 3. Um
erro sem `error.response` e sem `status`, com mensagem de CORS explícita no console do navegador,
é o item 2 — só então vira pedido formal ao backend.

## 6. Como manter este arquivo

- Ao concluir uma fase do plano de execução, mover os itens correspondentes da seção 2 para
  "Resolvido" (ou apagar a linha, mantendo o histórico no git).
- Ao receber resposta do time de backend sobre a seção 4, atualizar o status
  (`Aguardando backend` → `Implementado em <data>` ou `Recusado — motivo`) e, se implementado,
  revisar `docs/API_CONTRACT.md` para documentar o endpoint real (não mais "proposto").
- Nunca declarar uma violação da seção 2 como resolvida sem verificar o código — este documento é
  para ser conferido contra o repositório, não contra a intenção.
