/**
 * Configuração centralizada de URLs da API - Oficina Serra
 */

// PRODUÇÃO / DESENVOLVIMENTO LOCAL
const API_BASE_URL = 'http://localhost:8080/api';

export const API_CONFIG = {
  orcamentos: {
    baseUrl: `${API_BASE_URL}/orcamentos`
  },
  servicos: {
    baseUrl: `${API_BASE_URL}/servicos`
  },
  contato: {
    baseUrl: `${API_BASE_URL}/contato`
  }
} as const;

