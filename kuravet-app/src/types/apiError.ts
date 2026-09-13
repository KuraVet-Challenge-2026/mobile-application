
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  erro: string;
  mensagem: string;
  campos?: Record<string, string>;
}
