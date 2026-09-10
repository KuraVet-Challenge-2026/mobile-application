import React from 'react';

import EmptyState from '../components/EmptyState';

/**
 * Histórico de Diagnóstico ficou fora da Sprint 3 porque a funcionalidade ainda não foi
 * modelada em nenhuma camada — diferente de Teleconsulta, não existe hoje nem um endpoint
 * proposto para isso (ver `docs/API_CONTRACT.md` e `docs/PEDIDO_BACKEND.md`; nenhum dos dois
 * menciona diagnóstico).
 *
 * A rota e a entrada "Histórico" em "Ações Rápidas" (`Home.tsx`) foram mantidas de propósito em
 * vez de removidas — decisão de 2026-09-10 em `docs/AUDITORIA.md`, seção 1: o app já passa do
 * mínimo de 6 telas da rubrica sem contar este stub, e remover a rota quebraria a navegação da
 * Home e apagaria contexto de produto do briefing CLYVO VET sem necessidade.
 */
export default function HistoricoDiagnosticoScreen() {
  return (
    <EmptyState
      mensagem={
        'O histórico de diagnóstico do seu pet ainda não está disponível: o backend ainda não ' +
        'tem um endpoint para isso, então não há dado real para mostrar aqui (e este app não usa ' +
        'dado mockado no lugar de um dado real).\n\n' +
        'Quando esse endpoint existir, esta tela passa a mostrar o histórico real de consultas e ' +
        'exames de cada pet.'
      }
    />
  );
}
