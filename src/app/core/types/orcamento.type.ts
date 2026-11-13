export interface OrcamentoRequest {
  nome: string;
  email: string;
  telefone: string;
  veiculo: string;
  servico: string;
  data: string;
  descricao: string;
}

export interface OrcamentoRegistro extends OrcamentoRequest {
  id: string;
  servicoLabel: string;
  valorEstimado: number;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface OrcamentoResponse {
  sucesso: boolean;
  mensagem: string;
  registro?: OrcamentoRegistro;
}

export interface OrcamentoResumo {
  totalRegistros: number;
  valorTotalEstimado: number;
  valorMedioEstimado: number;
}
