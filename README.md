# 🐾 KuraVet Mobile

Aplicativo móvel desenvolvido para o Challenge FIAP, focado na gestão de saúde e agendamento de consultas veterinárias para animais de estimação. O projeto prioriza uma interface fluida, usabilidade e estabilidade local.

---

# 👥 Equipa de Desenvolvimento

- **Pedro Henrique Luiz Alves Duarte**
- **Guilherme Macedo Martins**
- **Henrique Martins**

> Turma: 2TDSPO / FIAP

---

# 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **[React Native](https://reactnative.dev/)** com **[Expo](https://expo.dev/)**
  - Framework principal para desenvolvimento mobile cross-platform.

- **[TypeScript](https://www.typescriptlang.org/)**
  - Tipagem estática para maior segurança e qualidade do código.

- **[React Navigation](https://reactnavigation.org/)**
  - Gerenciamento de rotas e navegação em abas (*Bottom Tabs*).

- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**
  - Persistência de dados local (simulação de banco de dados).

---

# ✨ Funcionalidades Implementadas

A aplicação foi estruturada para garantir o **“caminho feliz” completo do utilizador**, totalmente offline e à prova de falhas de rede durante a avaliação.

---

## 🔐 Autenticação e Sessão

### ✅ Login e Cadastro Local
Sistema real de verificação de credenciais. O tutor pode criar uma conta com validação de:

- Formato de e-mail
- Tamanho mínimo de senha

### ✅ UX Avançada no Login

- Utilização de `KeyboardAvoidingView`
- Feedback visual com `ActivityIndicator`
- Logotipo da equipa integrado

### ✅ Gestão de Sessão

- Persistência da sessão do utilizador
- Mantém o utilizador logado mesmo após fechar o aplicativo
- Botão **“Sair”** disponível nas rotas protegidas

---

## 🐶 Gestão de Pets (“Meus Pets”)

### Funcionalidades:

- Cadastro de pets com máscaras em tempo real:
  - Data de Nascimento (`DD/MM/AAAA`)
  - Peso (`00.0 kg`)

- Listagem dinâmica utilizando `AsyncStorage`

- Remoção de pets com:
  - Alerta de confirmação nativo
  - Segurança contra cliques acidentais

---

## 📅 Agendamento de Consultas

### Funcionalidades:

- Formulário para marcação de consultas
- Máscaras de:
  - Data
  - Hora (`HH:MM`)

- Persistência local das consultas

- Cancelamento de consultas com:
  - Confirmação dupla
  - Segurança contra exclusão acidental

- Botão auxiliar para limpar rapidamente os campos

---

## 🩺 Guia de Saúde

Ecrã informativo contendo:

- Diretrizes de primeiros socorros
- Triagem veterinária rápida:
  - Frequência Respiratória
  - TPC
  - Mucosa
  - Hidratação

---

# 🏗️ Arquitetura do Projeto

O código segue uma arquitetura baseada em camadas (*Layered Architecture*) adaptada para React Native, garantindo separação de responsabilidades.

```text
kuravet-mobile/
├── assets/                 # Imagens, ícones e logotipo (logo.png)
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/           # Estados globais (AuthContext.tsx)
│   ├── routes/             # Configuração do React Navigation (index.tsx)
│   ├── screens/            # Telas da aplicação
│   │   ├── Login
│   │   ├── Pets
│   │   ├── Agendamento
│   │   └── Guia
│   └── theme/              # Identidade visual (colors.ts)
├── App.tsx                 # Ponto de entrada da aplicação
└── app.json                # Configurações do Expo
```

---

# 🎨 Identidade Visual

A paleta de cores foi aplicada em todos os os componentes para garantir uma interface agradável e profissional.

| Elemento | Cor |
|---|---|
| Primária (Vinho) | `#5D4057` |
| Secundária (Terracota) | `#B55D5D` |
| Fundo (Off-White) | `#F9F1F1` |
| Branco (Cards/Textos) | `#FFFFFF` |

---

# 🛠️ Como Executar o Projeto

> Como o projeto utiliza o Expo, não é necessário instalar Android Studio ou Xcode.

---

## 1️⃣ Clone o repositório

```bash
git clone https://github.com/KuraVet-Challenge-2026/mobile-application.git
```

---

## 2️⃣ Acesse a pasta do projeto

```bash
cd mobile-application/kuravet-mobile
```

---

## 3️⃣ Instale as dependências

```bash
npm install
```

---

## 4️⃣ Inicie o servidor local do Expo

```bash
npx expo start
```

---

## 5️⃣ Visualize no dispositivo

1. Baixe o aplicativo **Expo Go** no Android ou iOS
2. Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi
3. Escaneie o QR Code gerado no terminal com o Expo Go

---

# 📌 Notas de Avaliação (Decisões de Projeto)

Para fins de estabilidade durante a avaliação académica, dependências externas como **Axios** e integrações com APIs Java/Docker foram intencionalmente substituídas pelo uso estruturado do:

```bash
@react-native-async-storage/async-storage
```

Essa decisão garante que todas as operações de CRUD:

- Create
- Read
- Update
- Delete

ocorram de forma:

- Instantânea
- Offline
- Estável
- Imune a falhas de rede nos laboratórios da instituição.

---
