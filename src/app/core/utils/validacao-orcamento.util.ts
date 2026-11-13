import { OrcamentoRegistro, OrcamentoRequest } from '../types/orcamento.type';
import { getDataMinimaHoje } from './date.util';

export interface ValidacaoResultado {
  valido: boolean;
  erros: string[];
  camposInvalidos: Record<string, string>;
}

const SERVICOS_EXIGEM_DESCRICAO_DETALHADA = new Set(['diagnostico', 'outro']);
const MIN_CARACTERES_DESCRICAO_DEPENDENTE = 15;

/**
 * Valida os dados de solicitação de orçamento aplicando regras de negócio da Oficina Serra:
 * 1. Intervalo de datas e funcionamento (sem datas passadas e fechado aos domingos);
 * 2. Campos dependentes (descrição detalhada >= 15 chars para Diagnóstico ou Outro);
 * 3. Duplicidade (mesmo veículo + serviço + data) e formato válido de telefone/e-mail/nome.
 */
export function validarOrcamento(
  dados: OrcamentoRequest,
  existentes: OrcamentoRegistro[],
  idEmEdicao: string | null = null
): ValidacaoResultado {
  const erros: string[] = [];
  const camposInvalidos: Record<string, string> = {};

  const registrarErro = (campo: string, mensagem: string): void => {
    erros.push(mensagem);
    if (!camposInvalidos[campo]) {
      camposInvalidos[campo] = mensagem;
    }
  };

  const nome = dados.nome.trim();
  if (nome.length < 3) {
    registrarErro('nome', 'Informe o nome completo com pelo menos 3 caracteres.');
  }

  const email = dados.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    registrarErro('email', 'Informe um endereço de e-mail válido.');
  }

  // Regra de formato de telefone brasileiro (DDD + 8 ou 9 dígitos)
  const digitosTelefone = dados.telefone.replace(/\D/g, '');
  if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
    registrarErro('telefone', 'Informe um telefone válido com DDD (10 ou 11 dígitos).');
  }

  const veiculo = dados.veiculo.trim();
  if (veiculo.length < 3) {
    registrarErro('veiculo', 'Informe o modelo/ano do veículo (mínimo 3 caracteres).');
  }

  if (!dados.servico) {
    registrarErro('servico', 'Selecione o serviço desejado.');
  }

  // Regra 1: Intervalo de datas e funcionamento da oficina (Seg - Sáb; Domingo fechado)
  if (dados.data) {
    const hoje = getDataMinimaHoje();
    if (dados.data < hoje) {
      registrarErro('data', 'A data desejada não pode ser anterior a hoje.');
    } else {
      const [ano, mes, dia] = dados.data.split('-').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      if (dataObj.getDay() === 0) {
        registrarErro(
          'data',
          'A Oficina Serra não funciona aos domingos. Selecione uma data de segunda a sábado.'
        );
      }
    }
  }

  // Regra 2: Campos dependentes (Diagnóstico ou Outro exigem descrição detalhada)
  const descricao = dados.descricao.trim();
  if (
    SERVICOS_EXIGEM_DESCRICAO_DETALHADA.has(dados.servico) &&
    descricao.length < MIN_CARACTERES_DESCRICAO_DEPENDENTE
  ) {
    registrarErro(
      'descricao',
      `Para o serviço selecionado, descreva o problema com pelo menos ${MIN_CARACTERES_DESCRICAO_DEPENDENTE} caracteres.`
    );
  }

  // Regra 3: Verificação de duplicidade (mesmo veículo + mesmo serviço + mesma data)
  if (veiculo && dados.servico) {
    const veiculoNormalizado = veiculo.toLowerCase();
    const dataNormalizada = dados.data || '';

    const duplicado = existentes.some(
      (item) =>
        item.id !== idEmEdicao &&
        item.veiculo.trim().toLowerCase() === veiculoNormalizado &&
        item.servico === dados.servico &&
        (item.data || '') === dataNormalizada
    );

    if (duplicado) {
      registrarErro(
        'veiculo',
        'Já existe um orçamento cadastrado para este veículo, serviço e data.'
      );
    }
  }

  return {
    valido: erros.length === 0,
    erros,
    camposInvalidos
  };
}

