# KuraVet — Aplicativo do Tutor

Aplicativo mobile desenvolvido para o Challenge FIAP 2026 em parceria com a CLYVO VET, na disciplina Mobile Application Development (2º ano de Análise e Desenvolvimento de Sistemas).

## Integrantes

| Nome completo | RM |
| --- | --- |
| Pedro Henrique Luiz Alves Duarte | _563405 |
| Guilherme Macedo Martins | 562396 |
| Henrique Martins | 563620|

## Vídeo de apresentação

https://youtube.com/shorts/a63KcsQltqU?is=kmSPCPqYz-ERG6no 




## O problema

O mercado pet brasileiro tem alto potencial de recorrência, mas o contato entre clínica e tutor costuma acontecer apenas em situações de urgência ou em gatilhos óbvios, como a vacinação. Consultas preventivas e check-ups são esquecidos, o histórico do animal fica espalhado entre atendimentos avulsos e o vínculo entre a clínica e o responsável se mantém fraco ao longo da vida do pet.

O resultado é uma jornada de cuidado descontínua: o tutor só age quando algo já deu errado.

## A solução

O KuraVet é o aplicativo do tutor dentro dessa jornada. Ele centraliza o cadastro dos animais sob responsabilidade de uma pessoa, mantém os dados do próprio tutor atualizados e dá visibilidade à rede de veterinários disponível, servindo como ponto de entrada para o acompanhamento contínuo da saúde do pet.

Toda informação exibida vem da API REST desenvolvida pelo grupo na disciplina de Java Advanced. O aplicativo não guarda dados de negócio localmente nem trabalha com conteúdo simulado.

## Funcionalidades

**Autenticação**
Cadastro e login contra a API Java, com credenciais armazenadas em `expo-secure-store`. A sessão é reidratada na abertura do aplicativo, de modo que o usuário não precisa autenticar novamente. O logout encerra a sessão e bloqueia imediatamente o acesso às telas protegidas.

**Meus pets (CRUD completo)**
Cadastro, listagem, visualização em detalhe, edição e exclusão dos animais do tutor autenticado. A lista reflete qualquer alteração automaticamente, sem necessidade de recarregar ou reiniciar o aplicativo.

**Meu perfil (CRUD completo)**
Leitura dos dados completos do tutor, edição dos campos cadastrais e exclusão da própria conta com confirmação. O identificador do tutor vem sempre da sessão autenticada; nenhuma tela aceita identificador arbitrário.

**Veterinários**
Listagem, somente leitura, dos profissionais disponíveis, com nome, especialidade e CRMV.

## Escopo: o que ficou fora da Sprint 3

O agendamento de teleconsultas e o histórico de diagnósticos estão previstos para a Sprint 4. As telas correspondentes existem e informam essa condição de forma explícita, sem simular funcionalidade.

## Tecnologias

As dependências principais utilizadas no ecossistema deste projeto são:

| Item | Versão |
| --- | --- |
| React Native | 0.86.3 |
| Expo SDK | ~57.0.21|
| TypeScript | ~6.0.3 |
| React Navigation | ^7.3.16 |
| TanStack Query | ^5.101.4 |
| Axios | ^1.19.0 |
| expo-secure-store | ~57.0.3|

A camada de dados usa TanStack Query para consultas e mutações, com invalidação de cache após cada escrita. As chamadas HTTP passam por um cliente Axios único, com interceptor responsável pelo cabeçalho de autorização.

## Arquitetura

```text
src/
  api/          funções tipadas por recurso, uma por endpoint
  auth/         contexto de autenticação, sessão e armazenamento seguro
  components/   componentes reutilizáveis
  hooks/        hooks de consulta e mutação, isolados da interface
  routes/       navegação e proteção de rotas por estado de autenticação
  screens/      telas, responsáveis apenas por apresentação
  types/        tipos espelhando os contratos da API
  utils/        utilitários compartilhados

A separação é estrita: nenhuma tela executa chamada HTTP diretamente e nenhuma regra de negócio vive em componente de interface. A navegação é feita exclusivamente por rotas declaradas no React Navigation, e o acesso às telas internas depende do estado de autenticação.

## Pré-requisitos

- Node.js 18 ou superior
- Aplicativo Expo Go instalado no smartphone
- API Java do projeto em execução (repositório `java-advanced`)
- Smartphone e computador na mesma rede Wi-Fi

## Como executar

**1. Suba a API Java**

Siga as instruções do repositório `java-advanced`. Confirme que ela responde antes de continuar.

**2. Descubra o IP da sua máquina na rede local**

No Windows, execute `ipconfig` e use o endereço IPv4 do adaptador Wi-Fi.

No macOS ou Linux, use `ifconfig` ou `ip addr`.

**3. Configure a URL da API**

Crie um arquivo `.env.local` na raiz do projeto:

```env
KURAVET_API_BASE_URL=http://SEU_IP:8080/api

O arquivo não é versionado, porque o endereço varia conforme a máquina e a rede.

**4. Instale as dependências e inicie**

```bash
npm install
npx expo start

**5. Abra no dispositivo**

Escaneie o QR Code com o Expo Go.

Para conferir a conectividade antes de abrir o aplicativo, acesse `http://SEU_IP:8080/api/ping` pelo navegador do celular.

Informe `http://` explicitamente: o navegador do Android força HTTPS ao receber um endereço IP.

Instruções detalhadas e solução de problemas comuns estão em [`docs/RODANDO_LOCAL.md`](docs/RODANDO_LOCAL.md).

<<<<<<< HEAD

=======
## Documentação complementar

| **Arquivo** | **Conteúdo** |
| --- | --- |
| `docs/API_CONTRACT.md` | Contrato dos endpoints consumidos |
| `docs/RUBRICA.md` | Critérios avaliativos da Sprint 3 |
| `docs/AUDITORIA.md` | Registro de decisões e pendências do projeto |
| `docs/RODANDO_LOCAL.md` | Execução em ambiente local |
>>>>>>> a7068ad3efe320668245e69a6f9ee0502cf241ef
