// Espelha o formato padrão de erro do ApiExceptionHandler (java-advanced) — ver
// docs/API_CONTRACT.md, seção Erros. `campos` só aparece em erro de validação (400 por
// @Valid/@NotBlank/etc. falhando); ausente nos demais 400/404.
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  erro: string;
  mensagem: string;
  campos?: Record<string, string>;
}
