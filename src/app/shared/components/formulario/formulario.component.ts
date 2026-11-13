import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ApiService } from '../../../core/services/apiService/api.service';
import { ServicoService } from '../../../core/services/servicoService/servico.service';
import {
  OrcamentoRegistro,
  OrcamentoRequest,
  OrcamentoResumo
} from '../../../core/types/orcamento.type';
import { ServicoItem, ServicoOpcao } from '../../../core/types/servico.type';
import { getDataMinimaHoje } from '../../../core/utils/date.util';
import { validarOrcamento } from '../../../core/utils/validacao-orcamento.util';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit, OnChanges, OnDestroy {
  private apiService = inject(ApiService);
  private servicoService = inject(ServicoService);

  @Input() servicosCarregados: ServicoItem[] = [];
  @Input() servicoPreSelecionado: string = '';

  opcoesServico: ServicoOpcao[] = [];
  dataMinima: string = '';
  enviando: boolean = false;

  // Estados de CRUD e Edição
  registros: OrcamentoRegistro[] = [];
  registrosFiltrados: OrcamentoRegistro[] = [];
  idEmEdicao: string | null = null;

  // Consulta, Filtro, Ordenação e Resumo
  termoBusca: string = '';
  filtroServico: string = '';
  ordenacao: 'recentes' | 'nome-asc' | 'valor-asc' | 'valor-desc' | 'data-asc' = 'recentes';
  resumo: OrcamentoResumo = {
    totalRegistros: 0,
    valorTotalEstimado: 0,
    valorMedioEstimado: 0
  };

  // Mensagens de validação e feedback
  errosValidacao: string[] = [];
  camposInvalidos: Record<string, string> = {};
  mensagemTexto: string = '';
  mensagemVisivel: boolean = false;
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  dadosFormulario: OrcamentoRequest = {
    nome: '',
    email: '',
    telefone: '',
    veiculo: '',
    servico: '',
    data: '',
    descricao: ''
  };

  ngOnInit(): void {
    this.opcoesServico = this.servicoService.listarOpcoesServico(this.servicosCarregados);
    this.definirDataMinima();
    this.carregarRegistros();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicosCarregados']) {
      this.opcoesServico = this.servicoService.listarOpcoesServico(this.servicosCarregados);
    }

    if (changes['servicoPreSelecionado'] && this.servicoPreSelecionado) {
      this.dadosFormulario.servico = this.servicoPreSelecionado;
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  definirDataMinima(): void {
    this.dataMinima = getDataMinimaHoje();
  }

  carregarRegistros(): void {
    this.registros = this.apiService.listarOrcamentos();
    this.aplicarFiltrosEOrdenacao();
  }

  aplicarFiltrosEOrdenacao(): void {
    this.registrosFiltrados = this.apiService.filtrarEOrdenarOrcamentos(
      this.registros,
      this.termoBusca,
      this.filtroServico,
      this.ordenacao
    );
    this.resumo = this.apiService.calcularResumo(this.registrosFiltrados);
  }

  async onSubmit(): Promise<void> {
    if (this.enviando) return;

    const validacao = validarOrcamento(
      this.dadosFormulario,
      this.registros,
      this.idEmEdicao
    );

    if (!validacao.valido) {
      this.errosValidacao = validacao.erros;
      this.camposInvalidos = validacao.camposInvalidos;
      this.exibirMensagem(
        'Corrija os campos destacados antes de enviar a solicitação.',
        'erro'
      );
      return;
    }

    this.errosValidacao = [];
    this.camposInvalidos = {};
    this.enviando = true;

    try {
      if (this.idEmEdicao) {
        const atualizado = this.apiService.atualizarOrcamento(
          this.idEmEdicao,
          { ...this.dadosFormulario },
          this.opcoesServico
        );

        if (atualizado) {
          this.exibirMensagem(
            `Orçamento de ${atualizado.nome} atualizado com sucesso!`,
            'sucesso'
          );
          this.cancelarEdicao();
          this.carregarRegistros();
        }
      } else {
        const resposta = await this.apiService.submitOrcamento(
          { ...this.dadosFormulario },
          this.opcoesServico
        );
        this.exibirMensagem(resposta.mensagem, 'sucesso');
        this.resetarFormulario();
        this.carregarRegistros();
      }
    } catch {
      this.exibirMensagem(
        'Erro ao enviar solicitação. Tente novamente mais tarde.',
        'erro'
      );
    } finally {
      this.enviando = false;
    }
  }

  iniciarEdicao(registro: OrcamentoRegistro): void {
    this.idEmEdicao = registro.id;
    this.errosValidacao = [];
    this.camposInvalidos = {};
    this.dadosFormulario = {
      nome: registro.nome,
      email: registro.email,
      telefone: registro.telefone,
      veiculo: registro.veiculo,
      servico: registro.servico,
      data: registro.data,
      descricao: registro.descricao
    };

    const formEl = document.getElementById('formularioOrcamento');
    formEl?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.errosValidacao = [];
    this.camposInvalidos = {};
    this.resetarFormulario();
  }

  excluirRegistro(id: string): void {
    const removido = this.apiService.excluirOrcamento(id);
    if (removido) {
      if (this.idEmEdicao === id) {
        this.cancelarEdicao();
      }
      this.carregarRegistros();
      this.exibirMensagem('Orçamento excluído da lista com sucesso.', 'sucesso');
    }
  }

  limparFiltrosLista(): void {
    this.termoBusca = '';
    this.filtroServico = '';
    this.ordenacao = 'recentes';
    this.aplicarFiltrosEOrdenacao();
  }

  exibirMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagemTexto = texto;
    this.tipoMensagem = tipo;
    this.mensagemVisivel = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.mensagemVisivel = false;
      this.timeoutId = null;
    }, 5000);
  }

  resetarFormulario(): void {
    this.dadosFormulario = {
      nome: '',
      email: '',
      telefone: '',
      veiculo: '',
      servico: '',
      data: '',
      descricao: ''
    };
  }
}
