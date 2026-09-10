import React from 'react';

import EmptyState from '../components/EmptyState';

/**
 * Teleconsulta ficou fora da Sprint 3 por dependência de endpoint de veterinários inexistente
 * no backend: `POST /api/consultas/solicitacoes` exige um `idVeterinario` válido e, sem
 * `GET /api/veterinarios`, não há forma real de escolher um sem recorrer a dado mockado
 * (proibido, CLAUDE.md regra 1). Read/Update/Delete de consulta já funcionam na API, mas sem
 * Create real a funcionalidade não fecha um CRUD completo — por isso não foi escolhida entre as
 * funcionalidades de CRUD da rubrica (ver `docs/AUDITORIA.md`, seção 3).
 *
 * A rota e a entrada "Nova Consulta" em "Ações Rápidas" (`Home.tsx`) foram mantidas de propósito
 * em vez de removidas — decisão de 2026-09-10 em `docs/AUDITORIA.md`, seção 1: o app já passa do
 * mínimo de 6 telas da rubrica sem contar este stub, e remover a rota quebraria a navegação da
 * Home e apagaria contexto de produto do briefing CLYVO VET sem necessidade.
 */
export default function TeleconsultaScreen() {
  return (
    <EmptyState
      mensagem={
        'Ainda não é possível solicitar uma teleconsulta pelo app: o backend ainda não tem um ' +
        'endpoint para listar os veterinários disponíveis, e sem ele não daria para escolher um ' +
        'de forma real (sem simular dado).\n\n' +
        'Assim que esse endpoint existir, esta tela passa a permitir solicitar, acompanhar e ' +
        'cancelar consultas de verdade, contra a API.'
      }
    />
  );
}
