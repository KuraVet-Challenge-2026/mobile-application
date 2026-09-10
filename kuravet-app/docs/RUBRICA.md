# Rubrica verificável — Sprint 3 (Mobile Application Development)

> Extraído literalmente de `docs/sprint3-requisitos.pdf`, seção "MOBILE APPLICATION DEVELOPMENT"
> (slides 31–42). Entrega: **12/09/2026**. Cada item é uma pergunta binária, respondível olhando o
> código — não a intenção. Pontuação total: **100 pontos**, mais penalidades (ver seção 2) que se
> aplicam por cima e podem zerar a nota independentemente da pontuação obtida aqui.
>
> Este documento é sobre a disciplina Mobile especificamente. As demais disciplinas do Challenge
> (Java Advanced, .NET, DevOps/Cloud, Banco de Dados, IA, Compliance/Azure Boards) têm suas
> próprias entregas na Sprint 3, resumidas na seção 3, mas não são o escopo deste repositório.

## 1. Critérios avaliativos (100 pontos)

> **Decisão do projeto (2026-09-02):** navegação exclusivamente via React Navigation (não usa
> expo-router — a rubrica abaixo aceita ambos, ver item 1.1) e autenticação exclusivamente contra
> a API Java (Firebase abandonado — ver item 1.3 e `docs/AUDITORIA.md`).

### 1.1 Navegação entre telas (5 pontos)

- [ ] O app possui **no mínimo 6 telas distintas**, cada uma representando uma funcionalidade ou
      fluxo diferente (telas duplicadas, vazias ou variações visuais da mesma tela não contam).
      (2 pts)
- [ ] A navegação é implementada com uma **biblioteca de navegação real** (React Navigation ou
      expo-router) — **sem** misturar as duas no mesmo app. (2 pts)
- [ ] Nenhuma tela usa `if`/`useState`/renderização condicional como substituto de navegação. (parte
      dos 2 pts acima)
- [ ] As rotas estão **explicitamente declaradas** (arquivo de rotas/layout, não implícitas). (1 pt)
- [ ] Toda navegação entre telas ocorre através dessas rotas declaradas — sem rota inexistente ou
      link quebrado. (parte do 1 pt acima)

### 1.2 Integração com API backend HTTP (35 pontos)

> Funcionalidades escolhidas para os "no mínimo 2" abaixo: **Pet** e **Tutor** (viáveis hoje sem
> mudança no backend). **Consulta/Teleconsulta** fica de fora até `GET /api/veterinarios` existir
> — ver análise completa em `docs/AUDITORIA.md`.

- [ ] Toda requisição HTTP usa **TanStack Query** (`useQuery`, `useMutation` ou equivalente) — não
      `fetch`/`axios` cru dentro de um `useEffect` de tela. (10 pts)
- [ ] Todo dado exibido em tela vem **exclusivamente da API** — zero dado mockado, arquivo local ou
      valor fixo no código como substituto de uma resposta real. (parte dos 10 pts acima)
- [ ] O app tem **no mínimo 2 funcionalidades distintas** dependentes da API, cada uma usando dados
      reais do backend e refletindo alterações feitas pelo usuário. (5 pts)
- [ ] Nas duas funcionalidades acima, **Create, Read, Update e Delete** estão implementados e
      acessíveis pela interface (não só pela camada de serviço). (10 pts)
- [ ] Nenhuma das duas funcionalidades tem CRUD parcial ou simulado (ex.: delete que só remove do
      estado local sem chamar a API). (parte dos 10 pts acima)
- [ ] A aplicação exibe estado de **loading** durante requisições (spinner/skeleton, não tela em
      branco). (10 pts)
- [ ] Alterações de dados refletem **automaticamente** na UI (invalidação de query / refetch), sem
      exigir reiniciar o app ou puxar para atualizar manualmente. (parte dos 10 pts acima)

### 1.3 Sistema de autenticação — Login (20 pontos)

> Decisão do projeto: usa a API Java (HTTP Basic + Spring Security), não Firebase — a rubrica
> aceita as duas opções, ver linha abaixo. Bloqueado até `POST /api/auth/cadastro` e
> `GET /api/auth/me` existirem no backend (`docs/API_CONTRACT.md`).

- [ ] O login usa um **serviço de autenticação real** (Firebase Authentication OU a API Java/.NET do
      Challenge) — não comparação de string local nem usuário fixo no código. (6 pts)
- [ ] Existem telas de **login e cadastro** funcionais. (parte dos 6 pts de "fluxo completo", 6 pts)
- [ ] A **sessão do usuário persiste** entre reaberturas do app (o usuário não precisa logar de novo
      toda vez que o app é reaberto). (parte dos 6 pts)
- [ ] Telas protegidas só são acessíveis **após** autenticação — um usuário não logado não consegue
      chegar nelas por navegação direta, deep link ou atalho. (4 pts)
- [ ] O controle de acesso está **integrado ao sistema de navegação** (ex.: stacks/guards
      condicionais), não apenas escondido visualmente. (parte dos 4 pts acima)
- [ ] Existe **logout funcional**, e após o logout o acesso às telas protegidas é bloqueado
      imediatamente. (4 pts)

### 1.4 Arquitetura e organização do código (20 pontos)

- [ ] O código separa claramente **interface (telas/componentes)**, **lógica de negócio** e
      **camada de acesso a dados/API**. (6 pts)
- [ ] Nenhum componente de tela contém regra de negócio ou chamada HTTP direta (fetch/axios não
      aparece dentro de `src/screens/**`). (parte dos 6 pts acima)
- [ ] O projeto tem uma **estrutura de pastas clara e padronizada** (não um dump de arquivos numa
      pasta só). (5 pts)
- [ ] É possível identificar de imediato onde estão telas, serviços, hooks e componentes
      reutilizáveis. (parte dos 5 pts acima)
- [ ] Lógica reutilizável está **abstraída em hooks ou serviços** — sem código duplicado entre
      telas sem justificativa. (5 pts)
- [ ] Os hooks do TanStack Query estão **isolados da camada de UI** (definidos fora dos arquivos de
      tela, ex.: em `src/hooks/`). (parte dos 5 pts acima)
- [ ] Nomes de arquivos, funções e variáveis são coerentes e autoexplicativos. (4 pts)
- [ ] O código não está excessivamente acoplado/confuso a ponto de dificultar evolução sem reescrita
      completa. (parte dos 4 pts acima)

### 1.5 Documentação e apresentação da entrega (20 pontos)

- [ ] O `README.md` descreve o **problema escolhido** e a **solução proposta**. (5 pts, junto com o
      item abaixo)
- [ ] O `README.md` lista as **tecnologias utilizadas** e as **instruções de execução** do projeto.
- [ ] Existe um **vídeo com narração** demonstrando o app em funcionamento, publicado no YouTube,
      com o link no `README.md`. (15 pts)
- [ ] O vídeo mostra, de forma clara: navegação entre telas, sistema de autenticação, integração com
      a API backend, e o app rodando em uso real (device/emulador). (parte dos 15 pts acima)
- [ ] O vídeo evidencia explicitamente os requisitos avaliativos desta sprint (não é só um passeio
      genérico pela UI). (parte dos 15 pts acima)
- [ ] O vídeo tem **no máximo 5 minutos**. (parte dos 15 pts acima)

## 2. Penalidades (descontos cumulativos, independentes da pontuação acima)

> "As penalidades são cumulativas. A aplicação de uma penalidade não exige a ocorrência de todos os
> itens listados sob ela. A identificação de um único caso representativo é suficiente. Podem
> resultar em nota final **zero**, independentemente da pontuação obtida nos critérios avaliativos."

| # | Penalidade | O que dispara | Desconto |
|---|---|---|---|
| I | Entrega fora do GitHub Classroom | Não usar o repositório oficial do GitHub Classroom | -20 pts |
| II | Ausência de vídeo | Vídeo não entregue ou em formato diferente do especificado | -20 pts |
| III | README ausente/insuficiente | Sem `README.md` ou documentação claramente insuficiente | -10 pts |
| IV | App fora do escopo das aulas | Uso de solução/framework/arquitetura não vista/autorizada em aula, de forma a **simplificar artificialmente** o desenvolvimento | -60 pts |
| V | Histórico de commits incoerente/inexistente/artificial | Poucos commits grandes, mensagens genéricas, ou upload único do projeto — falta de evolução gradual, commits frequentes e coerentes | -50 pts |
| VI | Integração simulada ou incompleta | Qualquer um: API só com GET; CRUD incompleto/simulado; código de integração não usado pela UI; dados da API ignorados/substituídos por mock; app precisa reiniciar para refletir dado; UI atualizada manualmente com `useState` após requisição em vez de invalidação de query | -20 pts |
| VII | Navegação simulada ou inexistente | Navegação não baseada em rotas reais: troca de componente na mesma tela, ou exibir/ocultar UI sem trocar de rota | -10 pts |
| VIII | Autenticação fictícia ou incompleta | Qualquer um: usuário/senha fixos no código; controle de acesso só com variável local/`useState`; tela protegida acessível sem login; sessão não persiste ou é simulada | -20 pts |
| IX | Arquitetura inadequada / código não manutenível | Toda lógica em componentes de tela; um único arquivo com múltiplas responsabilidades; repetição excessiva sem abstração; estrutura que dificulta leitura/manutenção | -30 pts |
| X | **App não funcional** | Não executa; não inicia (erro de build, crash ao abrir); falhas que impedem demonstrar as funcionalidades avaliativas; não permite rodar os fluxos principais durante a avaliação; depende de ajuste manual/configuração externa não documentada ou intervenção do professor para funcionar | **-100 pts (nota zero na Sprint)** |
| XI | Vídeo incompatível com o app entregue | Vídeo não demonstra o app real do repositório; mostra protótipo/Figma; mostra versão diferente da entregue; não permite confirmar inequivocamente que é o app avaliado | **-100 pts** |

## 3. Checklist de verificação rápida (para rodar antes de cada entrega)

- [ ] `npx expo start` sobe sem erro de build e sem crash na abertura em dispositivo/emulador real.
- [ ] Existem ≥ 6 telas com rota própria declarada explicitamente (arquivo de rotas / `app/` do
      expo-router).
- [ ] Busca por `fetch(` e `axios.` dentro de `src/screens/**` (ou `app/**`) retorna **zero**
      resultados.
- [ ] Busca por dados hardcoded suspeitos (arrays de objetos "fake", `MOCK`, `FALLBACK`,
      `dummy`) dentro de código de tela retorna **zero** resultados usados como fonte de dado real.
- [ ] Login/logout funcionam contra um serviço real, e fechar/reabrir o app **não** pede login de
      novo.
- [ ] Navegar direto para uma rota interna sem estar logado é bloqueado.
- [ ] Em pelo menos 2 funcionalidades: criar, ler, atualizar e excluir um registro funcionam pela UI
      e o resultado é visível sem reiniciar o app.
- [ ] `git log --oneline` mostra commits pequenos e frequentes com mensagens descritivas — não um
      único commit "projeto final".
- [ ] `README.md` tem: descrição do problema/solução, stack, como rodar, link do vídeo (≤ 5 min, com
      narração, no YouTube).
- [ ] Nenhum segredo (senha, token, chave privada) commitado — ver `CLAUDE.md` para a exceção
      documentada do Firebase API key (chave pública de cliente, não secreta).

## 4. Panorama das demais disciplinas na Sprint 3 (contexto, não escopo deste repo)

Resumo apenas para situar o Challenge como um todo — cada grupo entrega isso em repositórios/
disciplinas separadas, não neste projeto mobile:

- **Advanced Business Development with .NET**: Health Checks, logging estruturado (Serilog/NLog),
  tracing/métricas (OpenTelemetry), testes xUnit AAA + integração, README atualizado. (100 pts)
- **Compliance, Quality Assurance & Tests**: plano de projeto completo no Azure Boards (backlog,
  critérios de aceite, priorização, release plan, sprint atual detalhada). Fora de especificação:
  -10% na nota.
- **DevOps Tools & Cloud Computing**: deploy em Azure (ACR+ACI **ou** App Service + banco PaaS, sem
  misturar), banco em nuvem (não H2), CRUD real em ≥ 2 tabelas do CORE da solução, vídeo
  demonstrativo com CRUD evidenciado direto no banco. Múltiplas penalidades específicas por opção
  escolhida (ver PDF original, slides 15–16).
- **Disruptive Architectures: IoT, IoB & Generative IA**: componente de IA documentado (problema,
  dados, abordagem, arquitetura), vídeo pitch ~5 min, entregável em `.zip` com vídeo + repositório.
- **Java Advanced** (esta é a API consumida pelo mobile, ver `docs/API_CONTRACT.md`): Spring Boot
  com frontend (Thymeleaf), Flyway, Spring Security com 2 perfis e proteção de rotas, ≥ 2 fluxos
  funcionais completos (além de CRUD). Penalidades por violação de SOLID/DRY/Clean Code.
- **Mastering Relational and Non-Relational Database**: 2 procedures, 2 functions, 1 trigger de
  auditoria em Oracle, conversão manual para JSON (sem `TO_JSON`/`JSON_OBJECT` etc.), tratamento de
  exceções, script `.sql` completo.
