# KuraVet — App do Tutor

Aplicativo mobile do **Challenge FIAP 2026 × Clyvo Vet** (Sprint 4), desenvolvido em React Native + Expo SDK 57 + TypeScript. O código do app fica em `kuravet-app/`.

## 1. KuraVet e o problema que resolve

O mercado pet brasileiro tem alto potencial de recorrência, mas o contato entre clínica e tutor costuma acontecer só em urgências ou em gatilhos óbvios, como a vacinação. Check-ups são esquecidos, o histórico do animal fica espalhado e o tutor só age quando algo já deu errado.

O KuraVet é o app do tutor dentro dessa jornada: cadastra os pets, permite pedir uma triagem por IA a partir do relato dos sintomas, solicita e cancela teleconsultas, consulta o histórico de diagnósticos e avisa o tutor por notificação quando a triagem indica urgência ou quando é hora de reavaliar o pet.

Todos os dados vêm da API Java (repositório `java-advanced`). O app não guarda dados de negócio localmente, não usa conteúdo simulado e nunca chama um LLM diretamente: a análise é feita pela API.

## 2. Integrantes

Turma **2TDSPO**.

| Nome | RM |
| --- | --- |
| Guilherme | RM562396 |
| Pedro | RM563405 |
| Henrique | RM563620 |

## 3. Funcionalidades por tela

Todas as telas abaixo estão declaradas em `kuravet-app/src/routes/index.tsx`.

**Telas da Sprint 3**

| Tela | O que faz |
| --- | --- |
| Login | Autentica com usuário e senha (`GET /auth/me`) e reidrata a sessão ao abrir o app. |
| Cadastro | Cria a conta do tutor (`POST /auth/cadastro`) e já faz o login. |
| Home | Ações rápidas (Triagem IA, Nova Consulta, Meus Pets, Histórico), atalho para o Perfil e lista de próximas consultas. |
| CadastroPet | Cadastra um novo pet. |
| PetsList | Lista os pets do tutor. |
| PetDetalhe | Mostra os dados de um pet e permite excluí-lo. |
| EditarPet | Edita os dados de um pet. |
| HistoricoDiagnostico | Histórico de diagnósticos das consultas e de triagens, com filtro por pet. |
| Teleconsulta | Solicita teleconsulta (pet, veterinário, data futura e tipo) e cancela solicitações. |
| Perfil | Dados do usuário logado, acesso a Configurações e Sobre o App, e logout. |
| Configuracoes | Dados da conta e do tutor, com acesso à edição e à exclusão da conta. |
| EditarPerfil | Edita os dados cadastrais do tutor. |

**Telas da Sprint 4**

| Tela | O que faz |
| --- | --- |
| Triagem | Escolha do pet e relato dos sintomas (10 a 1000 caracteres). Envia para a API e abre o resultado. |
| TriagemDetalhe (Resultado da triagem) | Exibe urgência, recomendação, sintomas, selo da análise, orientação e aviso. Também é aberta ao tocar na notificação de urgência. |
| SobreApp (Sobre o App) | Versão, hash do commit, perfil do build, servidor da API e equipe. |

## 4. Arquitetura

```text
kuravet-app/
  App.tsx              providers: QueryClient, SafeArea, AuthProvider, NavigationContainer
  app.config.ts        config Expo; extra.apiBaseUrl, extra.commitHash, extra.buildProfile
  eas.json             perfil de build "preview" (APK)
  src/
    api/               axios: client.ts (Basic Auth por interceptor) + 1 arquivo por recurso
    hooks/             hooks TanStack Query por recurso (usePets, useConsultas, useTriagens, ...)
    services/          regra de negócio pura (triagemRegras, consultaRegras, notificacaoRegras)
    notifications/     tudo de expo-notifications (permissão, canais, agendamento, toque)
    theme/             paletas claro/escuro, useAppTheme, tema do React Navigation
    auth/              AuthContext e credenciais no expo-secure-store
    components/        componentes reutilizáveis (EmptyState, FormularioPet, ResultadoTriagem, ...)
    routes/            native stack, RootStackParamList, AuthStack x AppStack, navigationRef
    screens/           telas: apenas UI e chamada de hooks
    types/             tipos que espelham os DTOs da API
    utils/             apiErrorMessage, base64, formatarData, infoApp
```

**Responsabilidade de cada camada**

- `screens`: só interface e estado de formulário. Não importam `axios` nem `apiClient`.
- `hooks`: encapsulam o TanStack Query (consultas, mutações e invalidação de cache). Não fazem HTTP direto.
- `api`: único lugar com chamadas HTTP, uma função por endpoint.
- `services`: regras puras, sem UI e sem HTTP (ex.: rótulos de urgência, decisão da notificação).
- `notifications`: isola o `expo-notifications`.
- `theme`: paletas e `useAppTheme()`.

**Fluxo:** tela → hook → api → API Java. Exemplo: `TriagemScreen` chama `useCriarTriagem()` (`hooks/useTriagens.ts`), que chama `criarTriagem()` (`api/triagens.ts`), que faz `POST /triagens` pelo `apiClient`. Ao receber o 201, o hook invalida o cache e aciona `notificarResultadoTriagem()`.

## 5. Integração com a API Java

A URL base vem de `KURAVET_API_BASE_URL` → `app.config.ts` (`extra.apiBaseUrl`) → `src/api/client.ts`, e já termina em `/api`. Nenhuma URL ou credencial fica versionada.

**Autenticação:** HTTP Basic. O login chama `GET /auth/me` com usuário e senha. As credenciais ficam no `expo-secure-store` e um interceptor do axios adiciona o cabeçalho `Authorization` em cada requisição.

**Endpoints usados**

| Recurso | Endpoints |
| --- | --- |
| Autenticação | `GET /auth/me`, `POST /auth/cadastro` |
| Pets | `GET /pets`, `GET /pets/{id}`, `POST /pets`, `PUT /pets/{id}`, `DELETE /pets/{id}` |
| Tutores | `GET /tutores`, `GET /tutores/{id}`, `PUT /tutores/{id}`, `DELETE /tutores/{id}` |
| Veterinários | `GET /veterinarios` |
| Consultas | `GET /consultas`, `GET /consultas/{id}`, `POST /consultas/solicitacoes`, `PATCH /consultas/{id}/cancelamento` |
| Triagens | `POST /triagens`, `GET /triagens`, `GET /triagens/{id}` |

Erros da API chegam no formato `{ mensagem, campos? }` e são exibidos por `getApiErrorMessage` (`src/utils/apiErrorMessage.ts`).

## 6. Triagem por IA

- O tutor escolhe o pet e descreve os sintomas. A API devolve urgência (`BAIXA`, `MODERADA`, `ALTA` ou `EMERGENCIA`), recomendação, sintomas identificados, regras aplicadas, orientação e a indicação de teleconsulta prioritária.
- **A urgência é decidida pela API.** O app só exibe, nunca recalcula.
- O resultado mostra um selo discreto: **"Análise por IA"** ou **"Modo contingência"**. O modo contingência (extração por palavras-chave ou orientação de modelo fixo) é um resultado válido, não um erro.
- Quando a API sugere teleconsulta prioritária, o resultado mostra um botão que leva à tela Teleconsulta com o pet da triagem.
- **Aviso sempre exibido:** "Esta triagem é orientativa e não substitui a avaliação do veterinário." (não é duplicado se a orientação já trouxer o texto).
- A requisição tem timeout de 30 s (o restante do app usa 20 s), o botão de envio fica desabilitado enquanto ela pende e não há retry automático.

## 7. Notificações

São notificações **locais** (`expo-notifications`), disparadas por um evento real: o recebimento do 201 de `POST /triagens`.

| Urgência | Notificação |
| --- | --- |
| `ALTA` ou `EMERGENCIA` | Imediata, prioridade máxima, no canal "Triagens urgentes". |
| `BAIXA` ou `MODERADA` | Lembrete de reavaliação 48 h depois ("Como está o <pet>?"), no canal "Lembretes de reavaliação". Há um lembrete por pet: uma nova triagem cancela o anterior. |

**O toque leva à tela:**
- notificação urgente → Resultado da triagem (`TriagemDetalhe`), que busca `GET /triagens/{id}`;
- lembrete → tela Triagem com o pet já selecionado.

**Permissão e canais:** após o login, o app cria os canais no Android e então pede a permissão (no Android 13+ a permissão é obrigatória e o canal precisa existir antes do pedido). Sem permissão concedida, nenhuma notificação é agendada. As notificações também aparecem com o app aberto, e o logout cancela os lembretes agendados.

## 8. Tema claro/escuro

O app segue o tema do sistema (`userInterfaceStyle: automatic`). As telas usam `useAppTheme()` (`src/theme`), que entrega a paleta clara ou escura, e o React Navigation recebe o tema correspondente (`navigationTheme.ts`). Cores de urgência e de status de consulta também vêm dos tokens da paleta.

## 9. Como rodar

Pré-requisitos: Node.js 18 ou superior, API Java em execução (repositório `java-advanced`) e Expo Go, emulador Android ou aparelho na mesma rede.

```bash
cd kuravet-app
npm ci
cp .env.example .env.local     # no PowerShell: Copy-Item .env.example .env.local
# edite .env.local e ajuste KURAVET_API_BASE_URL
npx expo start
```

Valores de `KURAVET_API_BASE_URL` por ambiente:

| Ambiente | Valor |
| --- | --- |
| Emulador Android | `http://10.0.2.2:8080/api` |
| Celular físico | `http://<IP da máquina>:8080/api` |
| Web (mesma máquina da API) | `http://localhost:8080/api` (também é o fallback do `app.config.ts`) |

O `.env.local` é ignorado pelo Git e não deve ser versionado. Verificações: `npx tsc --noEmit` e `npm run lint`.

No Expo Go do Android o app roda sem notificações, por uma limitação do SDK 57 ([expo/expo#52175](https://github.com/expo/expo/issues/52175)); as notificações são validadas no APK distribuído pelo Firebase App Distribution.

## 10. Publicação

A publicação é feita manualmente pelo time.

- **EAS preview (APK):** o perfil `preview` de `kuravet-app/eas.json` gera um APK de distribuição interna, já apontando para a API publicada (`KURAVET_API_BASE_URL` definida no perfil).
- **Firebase App Distribution:** o APK gerado é distribuído aos testadores por esse serviço.
- **Tela Sobre o App:** mostra o hash do commit (`extra.commitHash`, preenchido em `app.config.ts` com o commit do build EAS), o perfil do build e o servidor da API, o que permite conferir qual versão está instalada.

Notificações devem ser validadas no APK publicado; o Expo Go não é a prova final.

## 11. Vídeo

Demonstração do APK publicado no Firebase App Distribution: https://youtu.be/BKm0kCUFv3g

## 12. Versão publicada

- **Versão:** 1.0.0 (versionCode 1), perfil EAS `preview`, publicada no Firebase App Distribution.
- **Commit de referência:** `7800fe4fd62ffb30d1fd10c0dac6adaf3b589c3a` (tag `v1.0-sprint4`), o mesmo exibido na tela **Sobre o App**.
- **API usada pelo APK:** https://kuravet-rm562396.azurewebsites.net/api
- Commits posteriores a esse hash alteram apenas documentação.
