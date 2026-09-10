// Espelha VeterinarioResponseDTO da API Java (GET /api/veterinarios) — ver
// docs/API_CONTRACT.md, seção Veterinários. Confirmado contra a API real em 2026-09-10 (não
// documentado como "proposto": já é o contrato de fato).
export interface Veterinario {
  idVeterinario: number;
  nome: string;
  crmv: string;
  especialidade: string;
  telefone: string | null;
  email: string | null;
}
