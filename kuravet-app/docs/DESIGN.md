# DESIGN.md — direção estética do KuraVet App

Documento de decisão de design, escrito antes de qualquer código do redesign (ver ordem de
trabalho combinada). Cobre a direção estética completa e o porquê de cada escolha. Qualquer
decisão de UI daqui em diante remete a este documento — se uma tela precisar de algo que não
está aqui, o documento é atualizado primeiro, não a exceção é aberta direto no código.

Este redesign é só de apresentação: paleta, tipografia, espaçamento e os componentes que
implementam isso. Nenhuma lógica de negócio, hook, chamada de API ou rota muda (ver
`CLAUDE.md`/`docs/AUDITORIA.md` para a arquitetura real, que continua exatamente como está).

## 1. Para quem e em que momento

O usuário é o tutor do pet, não um profissional de saúde. Ele abre o app em dois tipos de
momento bem diferentes: rotina (conferir se está tudo em dia, atualizar um dado) e preocupação
(o pet passou mal, precisa achar rápido o histórico ou marcar algo). Os dois momentos pedem a
mesma coisa: achar a informação certa rápido, sem precisar interpretar uma interface bonita mas
lenta de ler. Por isso a decisão de densidade de informação alta não é só uma restrição imposta,
é a consequência direta de quem usa isso e quando.

Isso também define o tom: cuidado sem ser fofo, e claro sem ser frio. Nada de linguagem de
efeito ("transforme a vida do seu pet") nem de UI decorativa que não carrega informação (ícone
grande sem dado ao lado, ilustração no lugar de dado real).

## 2. Referência estrutural: drauau.com.br

A análise foi feita sobre a página pública (o produto logado, atrás de autenticação, não é
acessível de fora) — a ressalva importa porque a lição tirada daqui é de hierarquia de
informação e tom, não de layout de tela específica.

Duas coisas transferem direto para o KuraVet App:

- **O sintoma/dado clínico concreto fica na frente, não a categoria genérica.** A página lista
  vômito, diarreia, problemas de pele, não "problemas de saúde". Traduzido para o app: a lista
  de pets mostra espécie e raça reais no item, não só o nome; o card de consulta mostra o tipo
  real da consulta, não um rótulo genérico.
- **Tom equilibrado entre acolhimento e precisão clínica.** A página mistura "cuidando com
  amor" com citação de resolução do CFMV. Não é 100% institucional nem 100% piegas. Traduzido
  para o app: textos de estado vazio/erro são diretos e específicos ("Você ainda não tem pets
  cadastrados", não "Ops, nada por aqui!"), sem infantilizar, mas sem tom de manual técnico.

O que **não** foi copiado: a estrutura da página é de site de conversão (herói, prova social,
FAQ) — não serve de referência de layout para telas de uso autenticado, que são o oposto disso
(painel de dados, não vitrine).

## 3. Cores: 2 cores de marca, com um trabalho definido para cada

Pesquisa de apoio (skill `ui-ux-pro-max`, domínio `color`): paletas de "Healthcare App" e "B2B
Service" foram usadas como ponto de partida, não copiadas — a maioria das paletas de saúde/pet
retornadas caía em ciano genérico de healthtech ou em laranja lúdico de claymorphism, os dois
descartados abaixo.

| Papel | Cor | Hex | Trabalho definido |
|---|---|---|---|
| Primária | Tinta (navy petróleo) | `#16324A` | Estrutura: texto de título, ícones ativos, botão primário, header. É a única cor que carrega peso visual — continuidade com o azul já associado à marca CLYVO VET, mas escurecido e puxado pra petróleo para não ler como "mais um app de saúde azul-claro genérico". |
| Secundária | Terracota | `#B5502E` | Só um trabalho: chamar atenção para algo que precisa de ação ou cuidado (badge de status pendente, um destaque pontual). Nunca usada como fundo de tela, nunca em área grande — se aparecer em mais de um elemento pequeno por tela, está sendo mal usada. |
| Neutro base | Areia | `#F4EFE8` a `#8A8078` (5 tons) | Fundo, texto secundário, bordas. Neutro **quente**, não cinza-azulado: um cinza puxado para azul, ao lado da Tinta, lê como "mais uma interface de SaaS"; puxado para areia, o app fica com identidade própria mesmo nas partes sem cor de marca. |
| Semântica: sucesso | Verde musgo | `#4B7853` | Confirmação (pet salvo, perfil atualizado). Cor própria, não é a secundária nem uma variação da primária, porque sucesso e atenção não podem competir pela mesma cor. |
| Semântica: erro/destrutivo | Vermelho telha | `#A33B2E` | Erro de validação, exclusão. Próximo da terracota em temperatura, mas claramente mais vermelho e mais escuro — dá pra diferenciar "isso precisa de atenção" de "isso é destrutivo" mesmo em visão periférica. |

Descartado explicitamente pela pesquisa e pelas restrições do usuário: gradiente
petróleo/violeta ou azul/violeta (apareceu como sugestão padrão de "app de saúde" mais de uma
vez na pesquisa, é exatamente o clichê que a restrição do usuário veta); a paleta laranja/azul
de Claymorphism sugerida pela busca por "pet app" (é lúdica demais para um app usado também em
momento de preocupação com a saúde do animal, e usa exatamente o par de cor cinza-neutro que
queremos evitar).

Uso em modo claro é o único suportado nesta fase (o app hoje não tem alternância de tema);
os tokens ficam preparados para dark mode depois, mas isso não faz parte deste redesign.

## 4. Tipografia: par com personalidade, papéis bem separados

Pesquisa de apoio (domínio `typography`): comparado par a par "News Editorial" (Newsreader +
Roboto), "Medical Clean" (Figtree + Noto Sans) e "Corporate Trust" (Lexend + Source Sans 3).
Nenhum dos três serve inteiro: os pares só-sans (Medical Clean, Corporate Trust) são seguros mas
não têm a personalidade que a restrição do usuário pede; o par com serifa (News Editorial) tem
a personalidade, mas o corpo em Roboto lê como fonte padrão de Android, o oposto do que se quer.

Decisão: recombinar as duas pontas que funcionam.

- **Newsreader** (serifa) para título de tela, nome do pet em destaque (no detalhe) e cabeçalho
  de estado vazio/erro. Só em textos grandes (20px ou mais) — é uma serifa desenhada para
  leitura longa, não para rótulo pequeno em lista. Traz o "não é fonte de sistema" e o
  acolhimento sem ficar lúdica.
- **Figtree** (sans humanista, levemente arredondada) para todo o resto: corpo, rótulo de
  campo, item de lista, botão. Precisa segurar legibilidade em texto pequeno numa tela densa,
  o que descarta a serifa para esse uso.

```
Google Fonts:
Newsreader:wght@400;500;600;700
Figtree:wght@400;500;600;700
```

Pacotes Expo (adicionam à camada de apresentação, não tocam lógica): `@expo-google-fonts/newsreader`
e `@expo-google-fonts/figtree`, carregados via `expo-font` (já é dependência do projeto, hoje
sem uso).

### Escala tipográfica

| Token | Tamanho | Fonte | Uso |
|---|---|---|---|
| `display` | 28 | Newsreader 600 | Título de tela, nome do pet no detalhe |
| `title` | 20 | Newsreader 600 | Cabeçalho de seção, título de estado vazio/erro |
| `body` | 15 | Figtree 400 | Texto corrido, valor de campo |
| `bodyStrong` | 15 | Figtree 600 | Rótulo em destaque, item de lista principal |
| `label` | 13 | Figtree 600 | Rótulo de campo de formulário, rótulo de card |
| `caption` | 12 | Figtree 400 | Texto auxiliar, hint, timestamp |

## 5. Espaçamento, raio e elevação

Escala de espaçamento em base 4, sem valor arbitrário fora dela:

```
space-1: 4    space-2: 8    space-3: 12   space-4: 16
space-5: 20   space-6: 24   space-7: 32   space-8: 48
```

`space-3` (12) é o espaçamento padrão entre itens de lista; `space-4` (16) é a margem padrão de
tela; `space-7`/`space-8` só entre seções, nunca dentro de um componente.

Raio, 3 níveis (nada de 20-28px de claymorphism em tudo):

```
radius-sm: 6    (input, badge)
radius-md: 10   (botão, item de lista)
radius-lg: 14   (card de destaque, folha de formulário)
```

Elevação: a maior parte da interface usa **borda de 1px em vez de sombra** — é a forma de ter
separação visual sem cair em "sombra difusa em tudo". Sombra real fica restrita a dois casos, e
sempre discreta (raio pequeno, opacidade baixa):

```
elevation-0: sem sombra, borda 1px solid (neutro-4). Uso: cards de lista, campos, a maioria da tela.
elevation-1: sombra sutil (offset 0/2, raio 4, opacidade 0.08). Uso: barra de ação fixa no rodapé
             (ex.: "+ Novo Pet"), modal/alerta.
```

## 6. Padrões proibidos (explícito, para checar contra cada tela)

- Emoji em qualquer lugar da interface.
- Travessão em texto de UI (usar ponto, vírgula ou reformular a frase).
- Gradiente, qualquer combinação de cor.
- Glassmorphism (blur, transparência sobre imagem/cor).
- Card com ícone circular centrado no topo como identidade do item (é o padrão usado hoje em
  `PetsListScreen`/`PetDetalheScreen`/`ConfiguracoesScreen` e sai neste redesign — substituído
  por identificação por texto e um traço de cor lateral, ver componente `ListItem`).
- Sombra difusa (raio grande, opacidade alta) em qualquer elemento que não seja
  `elevation-1` explicitamente.
- Linguagem de marketing em texto de UI: sem adjetivo de efeito, sem exclamação como recurso
  padrão, sem "incrível"/"transforme"/"experiência".

## 7. Componentes base (o que cada um é, antes do código)

Todos em `src/components/`, tipados, sem estado de negócio (recebem dado e callback, não
chamam hook nem API). Construídos sobre `Pressable`, não `TouchableOpacity` (feedback de toque
nativo, inclusive ripple no Android).

- **Button**: variante `primary` (fundo Tinta), `secondary` (borda Tinta, fundo transparente) e
  `destructive` (texto/borda Vermelho telha). Um único tamanho de altura (44, mínimo de toque),
  estado de carregamento embutido (troca o rótulo por indicador, não desaparece o botão).
- **Input**: rótulo sempre visível acima do campo (nunca só placeholder), espaço reservado para
  erro abaixo mesmo quando não há erro (evita o conteúdo "saltar" quando o erro aparece).
- **Card**: contêiner de conteúdo agrupado (ex.: bloco de dados no perfil). Borda 1px, sem
  sombra, sem ícone decorativo.
- **ListItem**: linha de lista (pet, item de configuração). Título forte (`bodyStrong`) mais um
  subtítulo (`caption`), e um traço vertical de 3px na cor semântica relevante quando fizer
  sentido (ex.: pendência), no lugar do ícone circular.
- **Badge**: rótulo de status curto (ex.: status de consulta). Fundo neutro claro com texto na
  cor semântica, nunca fundo colorido saturado.
- **EmptyState**: título (`title`, Newsreader) mais uma linha de corpo explicando o que fazer,
  mais uma ação quando aplicável. Nunca uma tela em branco, nunca só um ícone.
- **Skeleton**: bloco neutro com opacidade pulsante no formato do conteúdo real (linha de
  título, linha de corpo), no lugar de um spinner central sempre que o conteúdo final for uma
  lista ou formulário — preserva a posição do conteúdo (menos salto de layout) e comunica
  melhor "isto é uma lista carregando" do que um spinner genérico.
- **ErrorState**: mesmo formato do EmptyState, com título e corpo específicos do erro (usa
  `getApiErrorMessage`, já existente) e uma ação de tentar de novo quando a operação permite
  (`refetch`).

## 8. Estados vazio, carregamento e erro como parte do sistema

Não são um detalhe de cada tela, são parte do componente que a tela usa. Toda lista usa
`Skeleton` durante `isLoading`, `ErrorState` durante `isError`, `EmptyState` quando o array
vier vazio sem erro — a tela escolhe qual dos três renderizar, mas não desenha nenhum dos três
do zero. Todo formulário reserva o espaço de erro do `Input` mesmo sem erro presente, e usa
`Button` no estado de carregamento embutido em vez de trocar o botão por um spinner separado.

## 9. Rastreabilidade

Pesquisa feita com a skill `ui-ux-pro-max` (`--design-system`, e os domínios `style`, `color`,
`typography`, `ux`, e a stack `react-native`). Nenhum resultado foi usado tal como veio: a
paleta e a tipografia acima são uma recombinação deliberada, justificada seção por seção, não
o "melhor resultado" bruto da busca — os dois resultados de maior pontuação (Claymorphism laranja
e o par Newsreader/Roboto) foram descartados ou ajustados pelos motivos já explicados nas
seções 3 e 4.
