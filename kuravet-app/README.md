# KuraVet App

App mobile do tutor (responsável pelo pet), desenvolvido para o Challenge FIAP 2026 com a
CLYVO VET como cliente parceiro. Repositório da disciplina Mobile Application Development.

## Sobre o projeto

O briefing da CLYVO VET (`docs/briefing-clyvo.pdf`) descreve um problema estrutural do mercado
pet: o tutor só procura a clínica em situações de urgência ou em gatilhos óbvios, como a
vacinação. Consultas e exames preventivos ficam esquecidos, o vínculo entre clínica e tutor não
tem histórico estruturado, e oportunidades de acompanhamento se perdem por falta de continuidade.

Este app é a peça mobile dessa solução: o ponto de contato do tutor com a jornada de cuidado do
seu pet. Ele resolve, hoje, a parte da jornada que depende de o tutor ter uma conta própria,
segura, e conseguir manter os dados do seu pet e do seu próprio cadastro atualizados junto à
clínica, sem depender de ligar ou ir pessoalmente até lá para qualquer alteração simples. Isso é
o alicerce sobre o qual a continuidade preventiva (lembretes de vacina, retornos, protocolos por
espécie) pode ser construída depois: sem uma conta de tutor confiável e um cadastro de pet
correto, não tem como a clínica saber a quem e sobre qual animal lembrar de nada.

O componente de IA para personalização, os canais conversacionais (WhatsApp) e o modelo de
monetização citados no briefing são entregáveis de outras disciplinas do Challenge, não deste
repositório. Este README documenta apenas o que foi de fato implementado no app mobile.

### O que o app faz hoje

- Cadastro e login reais contra a API Java do projeto (Spring Security, HTTP Basic), com sessão
  persistida no dispositivo entre reaberturas do app.
- Logout, que bloqueia imediatamente o acesso às telas protegidas.
- CRUD completo de Pet: cadastrar, listar, ver detalhe, editar e excluir os pets do tutor
  autenticado.
- CRUD completo do perfil do próprio tutor ("Meu Perfil"): ver os dados completos do cadastro,
  editar e excluir a conta, sempre restrito ao próprio usuário logado.
- Todas as listas refletem criação, edição e exclusão automaticamente, sem precisar reabrir o
  app ou puxar para atualizar.

O que ainda não está implementado: vacinas e lembretes, teleconsulta (bloqueada até o backend
expor um endpoint de veterinários) e qualquer personalização por IA.

## Tecnologias utilizadas

Versões conforme `package.json` nesta entrega.

- Expo SDK 57 (`expo` ~57.0.21), React Native 0.86.3, React 19.2.3
- TypeScript ~6.0.3
- Navegação: React Navigation (`@react-navigation/native` ^7.3.16 e
  `@react-navigation/native-stack` ^7.18.8)
- Dados e integração com a API: TanStack Query ^5.101.4, Axios ^1.19.0
- Autenticação e armazenamento seguro: `expo-secure-store` ~57.0.3 (Keychain no iOS, Keystore no
  Android)
- Configuração de build: `expo-build-properties` ~57.0.17, usado para habilitar tráfego HTTP em
  claro no Android durante o desenvolvimento local (ver `docs/RODANDO_LOCAL.md`)
- Qualidade de código: ESLint 9 com `eslint-config-expo` ~57.0.2

Backend consumido: API Java (Spring Boot), repositório `java-advanced`, fora deste repositório.
Autenticação HTTP Basic via Spring Security, banco Oracle. Contrato completo em
`docs/API_CONTRACT.md`.

## Arquitetura e estrutura de pastas

Separação em três camadas: acesso a dados (`api/`), estado de servidor (`hooks/`) e apresentação
(`screens/`). Nenhuma tela chama a API diretamente; toda chamada HTTP passa por um hook do
TanStack Query, que por sua vez chama uma função tipada de `src/api/`.

```
src/
├── api/          Funções tipadas de acesso a API. client.ts monta a instância do axios e o
│                 interceptor de autenticação; pets.ts e tutores.ts espelham os endpoints reais
│                 do backend (GET/POST/PUT/DELETE)
├── auth/         AuthContext (login, cadastro, logout, sessão), persistência de credenciais em
│                 expo-secure-store, e o guard que decide qual stack de navegação mostrar
├── components/   Componentes de UI reutilizados entre telas (ex.: FormularioPet, usado tanto no
│                 cadastro quanto na edição de um pet)
├── hooks/        useQuery/useMutation do TanStack Query, isolados por domínio (usePets,
│                 useTutores, useConsultas), com invalidação de cache após cada mutation
├── routes/       Declaração das rotas (RootStackParamList) e o guard de autenticação
├── screens/      Telas, uma por arquivo, só de apresentação
├── types/        Tipos que espelham os DTOs reais da API Java
└── utils/        Tradução de erro da API para mensagem amigável, montagem do header Basic Auth
```

Outras decisões de arquitetura, com data e motivo, ficam registradas em `docs/AUDITORIA.md`.

## Como executar

### Pré-requisitos

- Node.js 18 ou superior e npm.
- App **Expo Go** instalado no celular (Android ou iOS), na mesma rede Wi-Fi do computador que
  vai rodar a API e o Metro.
- O repositório `java-advanced` (API Java) clonado, com Java, Maven e acesso ao banco Oracle
  configurados conforme o README daquele repositório.

### 1. Subir a API Java localmente

Na raiz do repositório `java-advanced`:

```bash
./mvnw spring-boot:run
```

Por padrão a API sobe na porta 8080. Para confirmar que está no ar, acesse
`http://localhost:8080/api/ping` (do próprio computador) e espere a resposta `pong`. O contrato
completo de endpoints está em `docs/API_CONTRACT.md`.

### 2. Instalar as dependências do app mobile

Na raiz deste repositório (`kuravet-app`):

```bash
npm install
```

### 3. Configurar KURAVET_API_BASE_URL

A base URL da API nunca fica fixa em um arquivo versionado. Copie o template e ajuste o valor:

```bash
cp .env.example .env.local
```

Edite `.env.local` (gitignorado, nunca commitar) e ajuste `KURAVET_API_BASE_URL` para o endereço
da API a partir de onde o app vai rodar. Para device físico, é o IP da máquina que está rodando a
API Java na rede local (ex.: `http://192.168.0.42:8080/api`), nunca `localhost`. O passo a passo
completo para descobrir esse IP, o ajuste de tráfego HTTP em claro exigido pelo Android, e os dois
problemas mais comuns ao testar pelo navegador do celular estão em `docs/RODANDO_LOCAL.md`.

### 4. Rodar no Expo Go em dispositivo físico

1. Confirme que a API está acessível pela rede: no navegador do próprio celular, acesse
   `http://<mesmo IP configurado acima>:8080/api/ping` e espere `pong` (ver
   `docs/RODANDO_LOCAL.md` se esse teste não funcionar de primeira).
2. Na raiz de `kuravet-app`, rode:

   ```bash
   npx expo start
   ```

3. O terminal mostra um QR code. Abra o Expo Go no celular e escaneie (Android: opção de
   escanear dentro do próprio app; iOS: pela câmera nativa, que oferece abrir no Expo Go).
4. O app carrega no celular via Metro, na mesma rede Wi-Fi. Sessão de login fica persistida no
   Keychain/Keystore real do aparelho.

Alternativa para emulador Android (AVD): mesmos passos, mas em `.env.local` use
`KURAVET_API_BASE_URL=http://10.0.2.2:8080/api` (alias fixo do emulador para a máquina host) e
rode `npx expo start --android`.

### 5. Roteiro rápido de verificação

1. Na tela de Cadastro, preencha nome, CPF, usuário e senha (usuário ainda não usado) e confirme.
   Deve cair direto na Home.
2. Feche o app completamente e reabra. Deve voltar direto para a Home, sem pedir login de novo.
3. Cadastre um pet, edite-o e depois exclua-o, confirmando que a lista de pets se atualiza sozinha
   em cada passo.
4. Em Perfil > Configurações, confira os dados completos do tutor e edite algum campo.
5. Em Perfil, toque em "Sair da Conta" e confirme. Deve voltar para a tela de Login, e as telas
   protegidas não devem mais estar acessíveis.

## Vídeo de demonstração

Link do vídeo no YouTube: A PREENCHER

Roteiro usado na gravação em `docs/ROTEIRO_VIDEO.md`.

## Integrantes

| Nome completo | RM |
|---|---|
| A PREENCHER | A PREENCHER |
| A PREENCHER | A PREENCHER |
| A PREENCHER | A PREENCHER |
| A PREENCHER | A PREENCHER |
