# Roteiro do vídeo de demonstração

Duração total: 5 minutos. Cada bloco abaixo indica o tempo, o que fazer na tela e o que narrar
em voz alta. O objetivo de cada bloco é deixar explícito qual item avaliativo da rubrica
(`docs/RUBRICA.md`, seção 1) está sendo demonstrado ali, não só passear pela interface.

Gravar direto no celular físico (Android ou iOS), com a API Java rodando de verdade na rede
local (ver `docs/RODANDO_LOCAL.md`). Não gravar em emulador nem em Expo Web: a sessão persistida
via Keychain/Keystore só existe no device físico.

## 0:00 a 0:15, abertura

Tela: qualquer uma, pode ser a tela de Login já aberta.

Narrar: nome do app (KuraVet), que é o mobile do Challenge FIAP 2026 com a CLYVO VET, e que o
vídeo vai mostrar autenticação real, navegação por rotas, integração com a API Java e o CRUD
completo de duas funcionalidades: Pet e Perfil do Tutor.

## 0:15 a 1:00, cadastro e autenticação real

Tela: Cadastro.

Fazer: preencher nome, CPF, usuário e senha de um usuário novo, confirmar.

Narrar: que a autenticação é contra a API Java real (Spring Security, HTTP Basic), não Firebase e
não usuário fixo no código. Ao confirmar, o app já cai direto na Home, sem passar pela tela de
Login: dizer que essa troca é automática, feita por um guard de navegação que lê o estado de
autenticação, não uma chamada manual de navegação.

Este bloco demonstra: autenticação com serviço real.

## 1:00 a 1:25, sessão persistida

Fechar o app completamente (não só minimizar) e reabrir.

Narrar, enquanto o app reabre: que ele volta direto para a Home, sem pedir login de novo, porque
a sessão fica salva no Keychain/Keystore do aparelho, não em memória.

Este bloco demonstra: sessão persistida entre reaberturas.

## 1:25 a 1:45, navegação por rotas reais

Tela: Home.

Fazer: tocar em duas ou três ações rápidas diferentes (por exemplo Meus Pets e Histórico) e
voltar para a Home entre uma e outra.

Narrar: que cada tela é uma rota declarada no React Navigation, alcançada por
`navigation.navigate`, não uma troca de estado dentro do mesmo componente.

Este bloco demonstra: navegação entre telas por rotas reais.

## 1:45 a 2:45, CRUD completo de Pet

Tela: Meus Pets, a partir da Home.

Fazer, em sequência:
1. Abrir Meus Pets (lista vazia ou com pets já existentes).
2. Tocar em Novo Pet, preencher o formulário, salvar. Mostrar a lista logo depois: o pet criado
   já aparece, sem sair do app ou puxar para atualizar.
3. Abrir o detalhe do pet recém-criado.
4. Tocar em Editar, mudar um campo (por exemplo a raça), salvar. Mostrar o detalhe atualizado.
5. Voltar e excluir esse mesmo pet, confirmando a exclusão. Mostrar a lista sem o pet.

Narrar durante o passo 2 e o passo 5, no momento em que a lista muda sozinha: que isso é
invalidação de cache do TanStack Query depois de cada mutação, não um `useState` local nem
reload manual.

Este bloco demonstra: integração real com a API, CRUD completo (Create, Read, Update, Delete) da
primeira funcionalidade, e lista atualizando automaticamente.

## 2:45 a 3:35, Read e Update do Perfil do Tutor

Tela: Perfil > Configurações.

Fazer:
1. Abrir Configurações e mostrar os dados completos do tutor (CPF, telefone, e-mail, endereço,
   data de cadastro).
2. Tocar em Editar Perfil, mudar um campo (por exemplo telefone), salvar.
3. Voltar para Configurações e mostrar o dado já atualizado.

Narrar: que esses dados completos vêm de uma chamada própria à API (`GET /api/tutores/{id}`), já
que o login sozinho não devolve CPF, telefone ou endereço.

Este bloco demonstra: Read e Update da segunda funcionalidade (Tutor).

## 3:35 a 4:05, Delete do Perfil do Tutor

Fazer, com uma conta de teste separada (para não perder a conta principal usada no resto do
vídeo):
1. Sair da conta principal, cadastrar rapidamente uma segunda conta de teste.
2. Ir direto em Perfil > Configurações > Excluir Conta.
3. Confirmar a exclusão na caixa de diálogo.

Narrar: que a exclusão pede confirmação explícita e, ao confirmar, a conta é apagada de verdade
na API e a sessão é encerrada, voltando para a tela de Login.

Este bloco demonstra: Delete real (não simulado) da segunda funcionalidade.

## 4:05 a 4:40, logout bloqueando telas protegidas

Fazer:
1. Logar de novo com a conta principal.
2. Ir em Perfil e tocar em Sair da Conta, confirmar.

Narrar: que depois do logout o app volta para a tela de Login e nenhuma tela protegida (Home,
Meus Pets, Configurações) fica acessível até logar de novo. Se der para mostrar, tentar voltar
para a Home pelo botão de voltar do celular e mostrar que continua na tela de Login.

Este bloco demonstra: logout funcional, com bloqueio imediato de telas protegidas.

## 4:40 a 5:00, encerramento

Narrar rapidamente: recapitular que o vídeo mostrou navegação real, autenticação persistida,
integração com a API Java e CRUD completo de Pet e de Perfil do Tutor, e que o código e a
documentação completa estão no repositório.
