import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicoService } from '../../../core/services/servicoService/servico.service';
import { ServicoItem, ServicosResumo } from '../../../core/types/servico.type';
import { CardHoverDirective } from '../../../core/directives/card-hover.directive';
import { FormularioComponent } from '../../../shared/components/formulario/formulario.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    CardHoverDirective,
    FormularioComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private servicoService = inject(ServicoService);

  servicos: ServicoItem[] = [];
  servicosFiltrados: ServicoItem[] = [];
  categorias: string[] = [];

  carregandoServicos = false;
  erroServicos: string | null = null;

  termoBusca = '';
  categoriaSelecionada = '';
  ordenacao: 'padrao' | 'nome-asc' | 'preco-asc' | 'preco-desc' = 'padrao';
  servicoSelecionadoParaOrcamento = '';

  resumoServicos: ServicosResumo = {
    total: 0,
    disponiveis: 0,
    precoMedio: 0
  };

  async ngOnInit(): Promise<void> {
    await this.carregarServicos();
  }

  async carregarServicos(url?: string): Promise<void> {
    this.carregandoServicos = true;
    this.erroServicos = null;

    try {
      const dados = await this.servicoService.carregarServicos(url);
      this.servicos = dados;
      this.categorias = Array.from(new Set(dados.map((s) => s.categoria))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
      );
      this.aplicarFiltros();
    } catch (error) {
      this.servicos = [];
      this.servicosFiltrados = [];
      this.resumoServicos = { total: 0, disponiveis: 0, precoMedio: 0 };
      this.erroServicos =
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os serviços no momento.';
    } finally {
      this.carregandoServicos = false;
    }
  }

  aplicarFiltros(): void {
    this.servicosFiltrados = this.servicoService.filtrarEOrdenarServicos(
      this.servicos,
      this.termoBusca,
      this.categoriaSelecionada,
      this.ordenacao
    );
    this.resumoServicos = this.servicoService.calcularResumoServicos(this.servicosFiltrados);
  }

  limparFiltrosServicos(): void {
    this.termoBusca = '';
    this.categoriaSelecionada = '';
    this.ordenacao = 'padrao';
    this.aplicarFiltros();
  }

  selecionarServicoParaOrcamento(servico: ServicoItem): void {
    if (!servico.disponivel) return;
    this.servicoSelecionadoParaOrcamento = servico.id;
    const secaoOrcamento = document.getElementById('orcamento');
    secaoOrcamento?.scrollIntoView?.({ behavior: 'smooth' });
  }
}
