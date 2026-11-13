import { Injectable } from '@angular/core';
import { ServicoItem, ServicoOpcao, ServicosResumo } from '../../types/servico.type';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private readonly defaultJsonUrl = '/data/servicos.json';

  private readonly opcoesFallback: ServicoOpcao[] = [
    { valor: 'troca-oleo', label: 'Troca de óleo', precoBase: 180 },
    { valor: 'bateria', label: 'Bateria', precoBase: 420 },
    { valor: 'freios', label: 'Sistema de Freios', precoBase: 350 },
    { valor: 'alinhamento', label: 'Alinhamento', precoBase: 120 },
    { valor: 'pneus', label: 'Pneus', precoBase: 140 },
    { valor: 'diagnostico', label: 'Diagnóstico', precoBase: 160 },
    { valor: 'outro', label: 'Outro', precoBase: 150 }
  ];

  /**
   * Carrega assincronamente a lista de serviços de um arquivo JSON local usando fetch + async/await.
   */
  async carregarServicos(url: string = this.defaultJsonUrl): Promise<ServicoItem[]> {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status} ao carregar serviços.`);
    }

    const dados = (await response.json()) as unknown;
    if (!Array.isArray(dados)) {
      throw new Error('Formato inválido no JSON de serviços.');
    }

    return dados as ServicoItem[];
  }

  listarOpcoesServico(servicos: ServicoItem[] = []): ServicoOpcao[] {
    if (servicos.length === 0) {
      return this.opcoesFallback;
    }

    const opcoes = servicos.map((s) => ({
      valor: s.id,
      label: s.titulo,
      precoBase: s.precoBase
    }));

    if (!opcoes.some((o) => o.valor === 'outro')) {
      opcoes.push({ valor: 'outro', label: 'Outro', precoBase: 150 });
    }

    return opcoes;
  }

  filtrarEOrdenarServicos(
    servicos: ServicoItem[],
    termoBusca: string,
    categoria: string,
    ordenacao: 'padrao' | 'nome-asc' | 'preco-asc' | 'preco-desc'
  ): ServicoItem[] {
    const termo = termoBusca.trim().toLowerCase();

    const filtrados = servicos.filter((servico) => {
      const correspondeCategoria = !categoria || servico.categoria === categoria;
      const correspondeBusca =
        !termo ||
        servico.titulo.toLowerCase().includes(termo) ||
        servico.descricao.toLowerCase().includes(termo) ||
        servico.categoria.toLowerCase().includes(termo);

      return correspondeCategoria && correspondeBusca;
    });

    const ordenados = [...filtrados];
    switch (ordenacao) {
      case 'nome-asc':
        ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
        break;
      case 'preco-asc':
        ordenados.sort((a, b) => a.precoBase - b.precoBase);
        break;
      case 'preco-desc':
        ordenados.sort((a, b) => b.precoBase - a.precoBase);
        break;
      default:
        break;
    }

    return ordenados;
  }

  calcularResumoServicos(servicos: ServicoItem[]): ServicosResumo {
    const total = servicos.length;
    if (total === 0) {
      return { total: 0, disponiveis: 0, precoMedio: 0 };
    }

    const disponiveis = servicos.filter((s) => s.disponivel).length;
    const somaPrecos = servicos.reduce((acc, s) => acc + s.precoBase, 0);

    return {
      total,
      disponiveis,
      precoMedio: somaPrecos / total
    };
  }
}
