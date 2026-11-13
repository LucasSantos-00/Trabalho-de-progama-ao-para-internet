import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormularioComponent } from '../../../shared/components/formulario/formulario.component';
import { ServicoService } from '../../../core/services/servicoService/servico.service';
import { ServicoItem } from '../../../core/types/servico.type';

@Component({
  selector: 'app-orcamentos',
  imports: [CommonModule, RouterLink, FormularioComponent],
  templateUrl: './orcamentos.component.html',
  styleUrl: './orcamentos.component.scss'
})
export class OrcamentosComponent implements OnInit {
  private servicoService = inject(ServicoService);

  servicos: ServicoItem[] = [];
  carregandoServicos = true;
  erroServicos: string | null = null;
  mostrarFormulario = false;

  async ngOnInit(): Promise<void> {
    await this.carregarServicos();
  }

  async carregarServicos(): Promise<void> {
    this.carregandoServicos = true;
    this.erroServicos = null;

    try {
      this.servicos = await this.servicoService.carregarServicos();
    } catch (erro) {
      this.erroServicos =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar o catálogo de serviços.';
    } finally {
      this.carregandoServicos = false;
    }
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  aoIniciarEdicao(): void {
    this.mostrarFormulario = true;
  }
}

