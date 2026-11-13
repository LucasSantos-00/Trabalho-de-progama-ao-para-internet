import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import {
  OrcamentoRegistro,
  OrcamentoRequest,
  OrcamentoResponse,
  OrcamentoResumo
} from '../../types/orcamento.type';
import { ServicoOpcao } from '../../types/servico.type';

const STORAGE_KEY = 'oficina_serra_orcamentos';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl = API_CONFIG.orcamentos.baseUrl;
  private registros: OrcamentoRegistro[] = this.carregarDoStorage();

  private carregarDoStorage(): OrcamentoRegistro[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      if (!bruto) return [];
      const parsed = JSON.parse(bruto);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private salvarNoStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.registros));
    } catch {
      // Ignora falhas de quota em navegação privada
    }
  }

  private gerarId(): string {
    return `orc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  private resolverMetadadosServico(
    servicoId: string,
    opcoes: ServicoOpcao[]
  ): { label: string; precoBase: number } {
    const encontrado = opcoes.find((o) => o.valor === servicoId);
    return {
      label: encontrado?.label ?? servicoId,
      precoBase: encontrado?.precoBase ?? 150
    };
  }

  listarOrcamentos(): OrcamentoRegistro[] {
    return [...this.registros];
  }

  async submitOrcamento(
    dados: OrcamentoRequest,
    opcoesServico: ServicoOpcao[] = []
  ): Promise<OrcamentoResponse> {
    const { label, precoBase } = this.resolverMetadadosServico(dados.servico, opcoesServico);

    const novoRegistro: OrcamentoRegistro = {
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      veiculo: dados.veiculo.trim(),
      descricao: dados.descricao.trim(),
      id: this.gerarId(),
      servicoLabel: label,
      valorEstimado: precoBase,
      criadoEm: new Date().toISOString()
    };

    // Simula comunicação assíncrona com resposta rápida no cliente
    return new Promise<OrcamentoResponse>((resolve) => {
      setTimeout(() => {
        this.registros = [novoRegistro, ...this.registros];
        this.salvarNoStorage();
        resolve({
          sucesso: true,
          mensagem: `Obrigado, ${novoRegistro.nome}! Sua solicitação de orçamento foi registrada com sucesso.`,
          registro: novoRegistro
        });
      }, 250);
    });
  }

  submitOrcamento$(dados: OrcamentoRequest): Observable<OrcamentoResponse> {
    return from(this.submitOrcamento(dados));
  }

  atualizarOrcamento(
    id: string,
    dados: OrcamentoRequest,
    opcoesServico: ServicoOpcao[] = []
  ): OrcamentoRegistro | null {
    const indice = this.registros.findIndex((r) => r.id === id);
    if (indice === -1) return null;

    const { label, precoBase } = this.resolverMetadadosServico(dados.servico, opcoesServico);
    const atualizado: OrcamentoRegistro = {
      ...this.registros[indice],
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      veiculo: dados.veiculo.trim(),
      descricao: dados.descricao.trim(),
      servicoLabel: label,
      valorEstimado: precoBase,
      atualizadoEm: new Date().toISOString()
    };

    this.registros = this.registros.map((item) => (item.id === id ? atualizado : item));
    this.salvarNoStorage();
    return atualizado;
  }

  excluirOrcamento(id: string): boolean {
    const tamanhoAnterior = this.registros.length;
    this.registros = this.registros.filter((item) => item.id !== id);
    if (this.registros.length !== tamanhoAnterior) {
      this.salvarNoStorage();
      return true;
    }
    return false;
  }

  limparOrcamentos(): void {
    this.registros = [];
    this.salvarNoStorage();
  }

  filtrarEOrdenarOrcamentos(
    registros: OrcamentoRegistro[],
    termoBusca: string,
    filtroServico: string,
    ordenacao: 'recentes' | 'nome-asc' | 'valor-asc' | 'valor-desc' | 'data-asc'
  ): OrcamentoRegistro[] {
    const termo = termoBusca.trim().toLowerCase();

    const filtrados = registros.filter((item) => {
      const correspondeServico = !filtroServico || item.servico === filtroServico;
      const correspondeBusca =
        !termo ||
        item.nome.toLowerCase().includes(termo) ||
        item.veiculo.toLowerCase().includes(termo) ||
        item.email.toLowerCase().includes(termo) ||
        item.servicoLabel.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo);

      return correspondeServico && correspondeBusca;
    });

    const ordenados = [...filtrados];
    switch (ordenacao) {
      case 'nome-asc':
        ordenados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        break;
      case 'valor-asc':
        ordenados.sort((a, b) => a.valorEstimado - b.valorEstimado);
        break;
      case 'valor-desc':
        ordenados.sort((a, b) => b.valorEstimado - a.valorEstimado);
        break;
      case 'data-asc':
        ordenados.sort((a, b) => (a.data || '9999-12-31').localeCompare(b.data || '9999-12-31'));
        break;
      case 'recentes':
      default:
        ordenados.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
        break;
    }

    return ordenados;
  }

  calcularResumo(registros: OrcamentoRegistro[]): OrcamentoResumo {
    const totalRegistros = registros.length;
    if (totalRegistros === 0) {
      return {
        totalRegistros: 0,
        valorTotalEstimado: 0,
        valorMedioEstimado: 0
      };
    }

    const valorTotalEstimado = registros.reduce((acc, item) => acc + item.valorEstimado, 0);
    return {
      totalRegistros,
      valorTotalEstimado,
      valorMedioEstimado: valorTotalEstimado / totalRegistros
    };
  }
}
