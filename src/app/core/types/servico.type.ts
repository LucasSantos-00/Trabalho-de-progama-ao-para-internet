export interface ServicoItem {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
  categoria: string;
  precoBase: number;
  tempoEstimado: string;
  disponivel: boolean;
}

export interface ServicoOpcao {
  valor: string;
  label: string;
  precoBase?: number;
}

export interface ServicosResumo {
  total: number;
  disponiveis: number;
  precoMedio: number;
}
