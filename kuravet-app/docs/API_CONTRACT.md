# Contrato da API KuraVet (java-advanced)

> Extraído em 2026-09-02 do repositório `https://github.com/KuraVet-Challenge-2026/java-advanced.git`
> (branch padrão, commit no momento do clone). Todos os payloads abaixo vêm diretamente dos
> `record`/`@Data` DTOs e dos controllers em `kuravet/src/main/java/br/com/fiap/kuravet/`, não de
> suposição. Onde a API **não** expõe algo que o app mobile precisa, está marcado explicitamente
> como **GAP**.

## Base URL e ambiente

- Base: `http://<host>:8080/api` (porta padrão do Spring Boot, sem `server.port` customizado em
  `application.properties`).
- Banco: Oracle (`oracle.fiap.com.br:1521:ORCL` por padrão, via `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`).
- CORS: liberado para `/api/**` em qualquer origem, métodos `GET,POST,PUT,PATCH,DELETE,OPTIONS`
  (`CorsConfig.java`). Nenhuma restrição de header.
- Não existe deploy hospedado conhecido — a API roda local (`mvnw spring-boot:run`) ou onde a
  disciplina DevOps Tools & Cloud Computing publicar (ver `docs/RUBRICA.md`).

## Autenticação

Decisão do projeto (2026-09-02, ver `CLAUDE.md`): a API Java é a **fonte única de identidade** do
app. Firebase foi abandonado. O app coleta `username`/`senha`, guarda em `expo-secure-store`, e
assina toda requisição com `Authorization: Basic base64(username:senha)` via interceptor do axios.

A API usa **HTTP Basic** (`SecurityConfig.java`), stateless, autenticando contra a tabela `USUARIO`
(login por `username`/`senha` com hash BCrypt) — não emite token, não JWT, não há endpoint de
"login" tradicional: a própria primeira requisição autenticada já valida as credenciais.

- Único endpoint público: `GET /api/ping`.
- Todo o resto exige o header `Authorization: Basic ...` em **toda requisição** (sem sessão, sem
  cookie, sem refresh token — cada chamada revalida contra o banco).

> [BLOQUEANTE] **Contradição com `POST /api/auth/cadastro` (descoberta em 2026-09-08, ver
> `docs/AUDITORIA.md` seção 5d e `docs/PEDIDO_BACKEND.md` item 5):** se a afirmação acima estiver
> correta, `/auth/cadastro` também exigiria Basic Auth — mas um tutor se cadastrando pela primeira
> vez não tem `username`/`senha` válidos para montar esse header. Ou a API já faz exceção para essa
> rota (e a lista acima está incompleta/desatualizada), ou o endpoint está de fato inutilizável.
> Tratado como pedido bloqueante ao backend enquanto não confirmado.
- Usuários seedados no banco (Flyway `V2`/`V3`) — **os únicos que existem hoje**:

  | username | senha | perfil | observação |
  |---|---|---|---|
  | `veterinario` | `vet123` | VETERINARIO | acesso ao portal web e à API |
  | `tutor` | `tutor123` | TUTOR | vinculado ao Tutor `id=1` ("Ana Beatriz Souza"), único tutor pré-cadastrado |

### Endpoints de autenticação — implementados (confirmado em 2026-09-03)

Historicamente `TutorController` criava só a linha em `TUTOR`, sem `USUARIO` associado — sem forma
de um tutor novo se auto-cadastrar e conseguir logar na API, e sem endpoint para o app validar
credenciais/obter o perfil do usuário logado. Os dois endpoints abaixo eram um contrato proposto
(`docs/PEDIDO_BACKEND.md`, itens 1/2); o backend confirmou a implementação em 2026-09-03 e o app
os consome desde a Fase 2 (`src/auth/AuthContext.tsx` — `login()`, `cadastro()`, bootstrap de
sessão). Formato mantido abaixo como documentação do contrato real.

#### `POST /api/auth/cadastro`

Cria `Tutor` + `Usuario` (perfil `TUTOR`) em uma única transação, com a senha já em BCrypt —
substitui o uso de `POST /api/tutores` para o fluxo de cadastro do app, que hoje não gera login.

Request:
```json
{
  "nome": "string, obrigatório",
  "cpf": "string, obrigatório",
  "telefone": "string, opcional",
  "email": "string, opcional, formato de e-mail",
  "endereco": "string, opcional",
  "username": "string, obrigatório, único",
  "senha": "string, obrigatório, política mínima a definir com o backend (ex.: 6+ caracteres)"
}
```

Response esperada `201 Created` (mesmo formato de `TutorResponseDTO` + dados de login):
```json
{
  "idTutor": 5,
  "nome": "Nome Completo",
  "cpf": "...",
  "telefone": "...",
  "email": "...",
  "endereco": "...",
  "dataCadastro": "2026-09-02",
  "username": "novo_username",
  "perfil": "TUTOR"
}
```

Erros esperados: `400` se `username` já existir (mensagem clara, ex. `"Nome de usuário já em
uso."`), `400` de validação nos mesmos moldes do `ApiExceptionHandler` já existente (campo por
campo). Não deve retornar a senha, nem em texto nem em hash, na resposta.

#### `GET /api/auth/me`

Autenticado (Basic). Retorna o perfil de quem está logado — usado pelo app para (a) validar a
combinação username/senha digitada no login antes de salvar no `expo-secure-store`, e (b) obter
`idTutor`/`perfil` sem precisar inferir de outro endpoint de negócio.

Response esperada `200 OK`:
```json
{
  "idUsuario": 2,
  "username": "tutor",
  "perfil": "TUTOR",
  "idTutor": 1,
  "nomeTutor": "Ana Beatriz Souza"
}
```
(`idTutor`/`nomeTutor` nulos quando `perfil` é `VETERINARIO`.)

Erros esperados: `401` (formato padrão do Spring Security) se `Authorization` ausente ou inválido —
é exatamente essa resposta que o app usa para decidir "login falhou, mostrar erro" vs. "login OK,
persistir credenciais".

> Consumidos por `Login.tsx`/`Cadastro.tsx` desde a Fase 2 (via `src/auth/AuthContext.tsx`) — ver
> `docs/AUDITORIA.md` para o histórico da decisão.

## Perfis e escopo de dados

- `Perfil`: `TUTOR` | `VETERINARIO` (`enums/Perfil.java`).
- Regra de dono: um `TUTOR` autenticado só vê/altera os **próprios** pets e consultas
  (`principal.getIdTutor()`), aplicada na camada de `service`, não na de rota.
- Registro de outro tutor retorna **404** (não 403), para não revelar que o recurso existe
  (`PetService.buscarPorId`, `ConsultaService.buscarPorId`).

## Endpoints

### Ping

| Método | Rota | Perfil | Request body | Response 200 |
|---|---|---|---|---|
| `GET` | `/api/ping` | público | — | `"pong"` (string, `text/plain`) |

### Pets — `PetController` (`/api/pets`)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `GET` | `/api/pets` | autenticado | Lista pets. TUTOR: só os próprios (`findByTutorIdTutor`). VETERINARIO: todos. |
| `GET` | `/api/pets/{id}` | autenticado | Busca por ID. 404 se não existir ou não for do tutor autenticado. |
| `POST` | `/api/pets` | `TUTOR` | Cadastra pet **para o tutor autenticado** (não recebe `idTutor` no corpo). |
| `PUT` | `/api/pets/{id}` | `TUTOR` | Atualiza pet próprio (dono não muda). |
| `DELETE` | `/api/pets/{id}` | `TUTOR` | Exclui pet próprio. Bloqueado (400) se o pet tiver consultas registradas. |

**Request — `PetRequestDTO`** (POST/PUT):
```json
{
  "nome": "string, obrigatório",
  "especie": "string, obrigatório",
  "raca": "string, opcional",
  "dataNascimento": "AAAA-MM-DD, obrigatório, deve estar no passado (@Past)",
  "sexo": "'M' ou 'F' (Character), obrigatório"
}
```
Não aceita `idTutor` — o dono é sempre o `TUTOR` autenticado via HTTP Basic.

**Response — `PetResponseDTO`** (200/201):
```json
{
  "idPet": 1,
  "nome": "Thor",
  "especie": "Cachorro",
  "raca": "Golden Retriever",
  "dataNascimento": "2021-03-15",
  "sexo": "M",
  "idTutor": 1,
  "nomeTutor": "Ana Beatriz Souza"
}
```

`DELETE` → `204 No Content`. Erro de regra (pet com consultas) → `400` no formato de erro padrão
(ver seção "Erros").

### Tutores — `TutorController` (`/api/tutores`)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `GET` | `/api/tutores` | autenticado | Lista **todos** os tutores (sem filtro por dono). |
| `GET` | `/api/tutores/{id}` | autenticado | Busca por ID. |
| `POST` | `/api/tutores` | autenticado | Cria um `Tutor` (não cria login/`USUARIO`). |
| `PUT` | `/api/tutores/{id}` | autenticado | Atualiza tutor. |
| `DELETE` | `/api/tutores/{id}` | autenticado | Exclui tutor. |

> [BLOQUEANTE] **Sem verificação de dono**: `TutorController` não usa `@AuthenticationPrincipal` em
> nenhum método — qualquer usuário autenticado (TUTOR ou VETERINARIO) pode ler, atualizar ou
> excluir **qualquer** tutor por ID, não só o próprio. Diferente de `PetController`/
> `ConsultaController`, que aplicam esse filtro na camada de service. Tratado como item bloqueante
> em `docs/PEDIDO_BACKEND.md` e `docs/AUDITORIA.md`, no mesmo nível dos endpoints de autenticação —
> é falha de controle de acesso, não um detalhe de polimento. Mitigação client-side enquanto não
> corrigido: o app só oferece UI para operar no `idTutor` do usuário logado (obtido via
> `GET /api/auth/me`, proposto acima) — isso reduz a exposição pelo próprio app, mas não corrige a
> falta de proteção no backend, ainda acessível por qualquer cliente HTTP.

> [ATENÇÃO] `GET /api/tutores` não filtra por dono — qualquer usuário autenticado (inclusive um TUTOR) lê
> nome/CPF/e-mail/telefone/endereço de **todos** os tutores cadastrados. É por isso que
> `src/screens/CadastroPet.tsx` hoje evita renderizar essa lista na tela (comentário explícito no
> código) — mas o dado ainda trafega para o dispositivo. Tratar como PII sensível ao decidir se
> esse endpoint deve continuar sendo chamado a partir do app do tutor.

**Request — `TutorRequestDTO`** (POST/PUT):
```json
{
  "nome": "string, obrigatório",
  "cpf": "string, obrigatório",
  "telefone": "string, opcional",
  "email": "string, opcional, formato de e-mail validado (@Email) se presente",
  "endereco": "string, opcional"
}
```

**Response — `TutorResponseDTO`**:
```json
{
  "idTutor": 1,
  "nome": "Ana Beatriz Souza",
  "cpf": "111.222.333-44",
  "telefone": "(11) 91234-5601",
  "email": "ana.souza@email.com",
  "endereco": "Rua das Flores, 120 - Sao Paulo/SP",
  "dataCadastro": "2024-01-10"
}
```

### Consultas (Teleconsulta) — `ConsultaController` (`/api/consultas`)

Máquina de estados (única fonte de verdade em `ConsultaService.TRANSICOES_PERMITIDAS`):

```
SOLICITADA ──aprovar──▶ AGENDADA ──diagnóstico──▶ REALIZADA
     │                      │
   recusar               cancelar
     ▼                      ▼
  RECUSADA              CANCELADA
```
`REALIZADA`, `RECUSADA`, `CANCELADA` são terminais. Transição fora do mapa → `400` com mensagem
`Transicao de status invalida: X -> Y`.

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `GET` | `/api/consultas?status=` | autenticado | Lista consultas (TUTOR: só as próprias). `status` opcional, um dos valores de `StatusConsulta`. |
| `GET` | `/api/consultas/{id}` | autenticado | Busca por ID. 404 se não for do tutor. |
| `POST` | `/api/consultas/solicitacoes` | `TUTOR` | Solicita teleconsulta → cria com status `SOLICITADA`. |
| `PATCH` | `/api/consultas/{id}/aprovacao` | `VETERINARIO` | `SOLICITADA` → `AGENDADA`. Sem corpo. |
| `PATCH` | `/api/consultas/{id}/recusa` | `VETERINARIO` | `SOLICITADA` → `RECUSADA`, com motivo obrigatório. |
| `PATCH` | `/api/consultas/{id}/diagnostico` | `VETERINARIO` | `AGENDADA` → `REALIZADA`, com diagnóstico obrigatório. |
| `PATCH` | `/api/consultas/{id}/cancelamento` | autenticado | `AGENDADA` → `CANCELADA`. Sem corpo. |
| `PUT` | `/api/consultas/{id}` | autenticado | Atualiza pet/veterinário/data/tipo — só se status ainda for `SOLICITADA` ou `AGENDADA`. |
| `DELETE` | `/api/consultas/{id}` | autenticado | Exclui a consulta. |

**Request — `ConsultaRequestDTO`** (POST `/solicitacoes` e PUT `/{id}`):
```json
{
  "idPet": 1,
  "idVeterinario": 2,
  "dataConsulta": "2026-10-01, obrigatório, deve ser data futura (@Future)",
  "tipoConsulta": "string, obrigatório, máx. 40 caracteres"
}
```
Não aceita `status`, `diagnostico` nem `motivoRecusa` — essas transições são exclusivas dos
endpoints PATCH específicos.

**Request — `DiagnosticoRequestDTO`** (PATCH `/diagnostico`):
```json
{ "diagnostico": "string, obrigatório, entre 15 e 400 caracteres" }
```

**Request — `RecusaRequestDTO`** (PATCH `/recusa`):
```json
{ "motivo": "string, obrigatório, entre 10 e 300 caracteres" }
```

**Response — `ConsultaResponseDTO`**:
```json
{
  "idConsulta": 12,
  "idPet": 1,
  "nomePet": "Thor",
  "idVeterinario": 2,
  "nomeVeterinario": "Dr. Rafael Andrade",
  "dataSolicitacao": "2026-08-27",
  "dataConsulta": "2026-10-01",
  "tipoConsulta": "Teleconsulta - Dermatologia",
  "diagnostico": null,
  "motivoRecusa": null,
  "status": "SOLICITADA"
}
```

**Regras de negócio embutidas** (validadas no `ConsultaService`, retornam `400` se violadas):
- O pet do `idPet` precisa pertencer ao tutor autenticado.
- O `idVeterinario` precisa existir (senão `400`, mensagem "Veterinario nao encontrado...").
- O pet não pode ter outra consulta `SOLICITADA`/`AGENDADA` na mesma `dataConsulta`.
- `PUT /{id}` só funciona se a consulta ainda estiver `SOLICITADA` ou `AGENDADA`.

### Veterinários — [GAP] não existe controller de API

Não há `VeterinarioController` nem qualquer rota `/api/veterinarios*`. Existe `Veterinario` como
entidade JPA e `VeterinarioRepository`, mas nenhum endpoint REST os expõe. **Consequência direta**:
o app mobile não tem como listar veterinários disponíveis para preencher `idVeterinario` ao montar
o formulário de "Nova Consulta" (`src/screens/TeleconsultaScreen.tsx`, hoje um stub vazio). Isso
precisa ser resolvido com o time do backend (pedir `GET /api/veterinarios`) antes de implementar o
fluxo de solicitação de teleconsulta — usar um ID fixo no app violaria a regra de "zero dados
mockados".

## Erros — formato padrão (`ApiExceptionHandler`, escopo `controller.api`)

Recurso não encontrado (`PetNaoEncontradoException`, `TutorNaoEncontradoException`,
`ConsultaNaoEncontradaException`) → **404**:
```json
{
  "timestamp": "2026-08-27T21:10:00",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Pet com ID 999 não encontrado."
}
```

Violação de regra de negócio (`RegraDeNegocioException`) → **400**, mesmo formato acima com
`status: 400`, `erro: "Bad Request"`.

Erro de validação de campo (`@Valid` falhou) → **400**, com detalhe por campo:
```json
{
  "timestamp": "2026-08-27T21:10:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "Erro de validacao nos campos informados.",
  "campos": { "dataConsulta": "A data desejada precisa ser futura." }
}
```

Falha de autenticação (`Authorization` ausente/inválido) → **401**, corpo padrão do Spring Security
(não passa pelo `ApiExceptionHandler`, que só cobre `/controller/api/**`).

Falha de autorização por perfil (rota exige `TUTOR`/`VETERINARIO` e o usuário tem o outro perfil)
→ **403**, corpo padrão do Spring Security.

## Não usar no app mobile

- `/portal/**` e `/login` — Thymeleaf server-rendered, exclusivo do perfil `VETERINARIO`, roda em
  sessão HTTP com CSRF habilitado. Nada disso é consumível como API por um cliente mobile.

## Resumo de gaps — status para o time de backend (java-advanced)

| # | Gap | Impacto no app mobile | Status |
|---|---|---|---|
| 1 | `POST /api/auth/cadastro` (Tutor + Usuario juntos) | Cadastro real de novos tutores | **Implementado** (confirmado 2026-09-03) — consumido desde a Fase 2 |
| 2 | `GET /api/auth/me` | Validar login e obter perfil sem gambiarra | **Implementado** (confirmado 2026-09-03) — consumido desde a Fase 1/2 |
| 3 | Sem `GET /api/veterinarios` | Bloqueia Create de Consulta/Teleconsulta (não dá pra escolher `idVeterinario` sem mockar) | **Pedido a fazer** — aguardando backend |
| 4 | `TutorController` sem verificação de dono | Qualquer autenticado edita/exclui tutor de terceiros | Mitigado client-side (app só opera no próprio `idTutor`); correção real é no backend |
| 5 | `GET /api/tutores` retorna PII de todos os tutores, sem filtro | Vazamento de dado sensível para qualquer autenticado | Mitigado no app: nunca renderizar a lista completa em tela |

Ver `docs/AUDITORIA.md` para o rastreamento vivo destes itens (decisão tomada, o que falta, quem
bloqueia o quê) conforme o projeto avança.
