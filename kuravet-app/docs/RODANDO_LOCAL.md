# Rodando local — device físico via Wi-Fi

Passo a passo para apontar o app (via Expo Go, em device físico) para a API Java rodando na
própria máquina de desenvolvimento, na rede Wi-Fi local — e os dois problemas de navegador que
custaram tempo na primeira tentativa. Ver também `README.md`, seção "Base URL por ambiente" (tabela
completa por ambiente: Web, emulador, device físico) e "Como rodar via Expo Go em device físico"
(passo a passo de rede/firewall).

## 1. Configurar a base URL (sem comitar o IP)

A base URL da API não fica fixa em nenhum arquivo versionado — vem de `.env.local`
(gitignorado, `.gitignore` > `.env*.local`), lido por `app.config.ts` na variável
`KURAVET_API_BASE_URL` e exposto ao app em `expo.extra.apiBaseUrl` (`src/api/client.ts`).

1. Se ainda não existir, copie o template: `.env.example` → `.env.local`.
2. Em `.env.local`, defina `KURAVET_API_BASE_URL=http://<IP da sua máquina na rede local>:8080/api`
   (ex.: `http://192.168.0.83:8080/api`). Para descobrir o IP, ver `README.md`, passo 1 da seção
   "Como rodar via Expo Go em device físico".
3. Se o Metro (`npx expo start`) já estava rodando, **reinicie-o** — o Expo CLI só relê `.env*`
   na subida do processo, uma edição em `.env.local` com o servidor já de pé não tem efeito até
   reiniciar.
4. Confirme que a API está acessível pela rede antes de abrir o app: no navegador do celular,
   acesse `http://<mesmo IP>:8080/api/ping` e espere a resposta `Pong`. Ver seção 3 abaixo — dois
   jeitos comuns desse teste dar falso-negativo mesmo com a API no ar.

## 2. Tráfego HTTP em claro no Android

A partir do target SDK usado pelo Expo SDK 57, o Android bloqueia por padrão qualquer requisição
de rede para um host que não seja HTTPS. Como a API Java local roda em HTTP simples (sem
certificado), isso derruba toda chamada do app — mesmo com a base URL certa.

O Expo SDK 57 não tem mais `usesCleartextTraffic` como propriedade direta de `android.*` no
config — o mecanismo real é o plugin `expo-build-properties`, que edita o `AndroidManifest`
nativo:

```ts
// app.config.ts, dentro de plugins:
['expo-build-properties', { android: { usesCleartextTraffic: true } }],
```

**[ATENÇÃO — só tem efeito com rebuild nativo]** Isso edita o `AndroidManifest.xml` do projeto
nativo, gerado por `npx expo prebuild` (ou por um build de dev client via EAS/`expo run:android`).
**Não tem efeito nenhum no app Expo Go baixado da Play Store** — o manifest dele é fixo,
compilado pela própria Expo, e não lê `app.config.ts` do seu projeto. Na prática isso não bloqueia
o fluxo documentado no `README.md` ("Como rodar via Expo Go em device físico"): o Expo Go já
precisa falar HTTP com o Metro/backend de dev por padrão, então o cenário mais comum é o app já
funcionar em Expo Go sem esse plugin. Ele só passa a ser necessário se/quando o projeto migrar
para um **dev client próprio** (build nativo customizado) — aí sim vale rodar `npx expo prebuild`
(ou o build de dev client) para o `AndroidManifest` gerado incorporar o flag.

**[SÓ DESENVOLVIMENTO LOCAL]** Este plugin existe unicamente para permitir testar contra a API
rodando em HTTP na rede local durante o desenvolvimento. A entrega de DevOps expõe a API via
HTTPS (certificado real) — quando isso estiver no ar, o plugin deixa de ser necessário e deve ser
removido (ou restrito a uma variante de build de desenvolvimento, se o app continuar precisando
apontar para HTTP local em algum cenário). Não é uma configuração para levar para produção.

## 3. Checklist / problemas conhecidos ao testar o `/ping` no navegador do celular

Antes de suspeitar do app ou do backend, descarte estes dois problemas do próprio navegador —
ambos fizeram o teste manual do `/ping` parecer falhar quando a API estava, na verdade, no ar e
acessível:

- **O navegador do Android reescreve o IP digitado para HTTPS.** Alguns navegadores (ex.: Chrome
  com "HTTPS-First"/"Always use secure connections" ativo) promovem automaticamente qualquer
  endereço digitado na barra — incluindo um IP simples como `192.168.0.83:8080` — para
  `https://`, mesmo sem você ter digitado o esquema. Contra uma API que só fala HTTP, isso dá
  erro de conexão/certificado que não tem nada a ver com a API estar no ar ou não. **Sempre
  digite o esquema explicitamente** (`http://192.168.0.83:8080/api/ping`, com o `http://` na
  frente) — e, se o navegador ainda reescrever para `https://` de qualquer forma, ver o item de
  cache abaixo ou desativar a opção "sempre usar conexões seguras" nas configurações do navegador
  para esse teste.
- **O Chrome pode cachear o redirecionamento HTTP→HTTPS anterior.** Depois de uma tentativa que
  caiu em HTTPS (item acima) e falhou, novas tentativas do mesmo endereço podem continuar sendo
  redirecionadas mesmo depois de corrigir a URL — o Chrome guarda esse comportamento por origem.
  **Testar em uma guia anônima** (sem o cache/estado daquela origem) resolve; se resolver, é sinal
  de que o problema era só o cache do navegador, não a API nem o app.

## 4. Roteiro de verificação (depois de 1-2 acima)

Ver `README.md`, seção "Como rodar via Expo Go em device físico", passos finais: cadastro → login
→ fechar e reabrir o app → Home → logout, tudo contra a API real na rede local.
