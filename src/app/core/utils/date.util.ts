/**
 * Retorna a data atual no formato YYYY-MM-DD para definir o atributo min de inputs de data
 */
export function getDataMinimaHoje(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

