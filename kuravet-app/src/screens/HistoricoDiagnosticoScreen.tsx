import React from 'react';

import EmptyState from '../components/EmptyState';

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
