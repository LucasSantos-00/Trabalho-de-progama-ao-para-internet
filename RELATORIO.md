# Relatório Técnico — Oficina Serra (2º Bimestre)

> **Repositório do Projeto (GitHub):**  
> Link clicável: [https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git](https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git)  
> Link por extenso: `https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git`

> **Orientações de Formatação para Entrega em PDF (Portal Multivix):**  
> Ao converter este relatório para PDF (ex.: via Word, LibreOffice Writer ou Google Docs), aplicar: **papel A4**, margens **3 cm (superior e esquerda)** e **2 cm (inferior e direita)**, fonte **Arial ou Times New Roman tamanho 12**, espaçamento **1,5 entre linhas** e inserção dos **prints das telas** nas seções indicadas.

---

## Capa

**FACULDADE MULTIVIX — VITÓRIA**  
**DISCIPLINA:** Programação para Internet  

**TÍTULO:**  
**Oficina Serra — Evolução de Protótipo Web com Gerenciamento de Dados (CRUD), Validação Avançada e Comunicação Assíncrona**

**INTEGRANTES:**  
- Lucas Silva A Dos Santos  
- Luiz Fernando Crispim  
- Matheus Aguiar Xemenes  

**PROFESSOR:** Elionai  

Vitória — ES  
2026

---

## Folha de Rosto

**Lucas Silva A Dos Santos**  
**Luiz Fernando Crispim**  
**Matheus Aguiar Xemenes**  

**Oficina Serra — Evolução de Protótipo Web com Gerenciamento de Dados (CRUD), Validação Avançada e Comunicação Assíncrona**

Relatório técnico apresentado à disciplina de Programação para Internet da Faculdade Multivix — Vitória, como requisito avaliativo do 2º bimestre de 2026.

**Professor:** Elionai  

**Repositório Público no GitHub:**  
[https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git](https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git)  
(`https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git`)

Vitória — ES  
2026

---

## Sumário

1. [Introdução](#1-introdução)  
2. [Descrição do Projeto e Arquitetura](#2-descrição-do-projeto-e-arquitetura)  
3. [Funcionalidades Implementadas](#3-funcionalidades-implementadas)  
   3.1. [Base Existente (HTML Semântico, Navegação e Responsividade)](#31-base-existente-html-semântico-navegação-e-responsividade)  
   3.2. [Validação Aprimorada e Máscara de Entrada](#32-validação-aprimorada-e-máscara-de-entrada)  
   3.3. [Gerenciamento de Registros (CRUD no Cliente)](#33-gerenciamento-de-registros-crud-no-cliente)  
   3.4. [Consulta, Organização e Resumo Calculado](#34-consulta-organização-e-resumo-calculado)  
   3.5. [Comunicação Assíncrona com `fetch` e `async/await`](#35-comunicação-assíncrona-com-fetch-e-asyncawait)  
4. [Testes e Resultados](#4-testes-e-resultados)  
5. [Conclusão](#5-conclusão)  
6. [Referências](#6-referências)  

---

## 1. Introdução

O presente relatório documenta a evolução do protótipo web **Oficina Serra — Serviços Automotivos** para o 2º bimestre da disciplina de Programação para Internet (Multivix — Vitória). Enquanto a etapa anterior teve como foco a estruturação semântica em HTML, a estilização responsiva e a interface inicial de apresentação da oficina mecânica, esta segunda etapa concentra-se na **lógica de aplicação no cliente**, incorporando carregamento assíncrono de dados a partir de um arquivo JSON local, regras de validação orientadas ao negócio, operações completas de gerenciamento de registros (CRUD) sem recarregamento de página, busca dinâmica, filtros, ordenação e cálculo de resumos.

Para manter a organização modular e escalável, o projeto foi estruturado em **Angular 21** com **TypeScript**, preservando integralmente o layout, a identidade visual e a semântica da página original, ao mesmo tempo em que separa responsabilidades entre componentes de visualização, serviços de dados e utilitários de validação.

---

## 2. Descrição do Projeto e Arquitetura

A aplicação **Oficina Serra** simula o portal de atendimento e solicitação de orçamentos de uma oficina automotiva localizada na Serra (ES). O código-fonte completo encontra-se disponível publicamente no GitHub:

- **Link clicável:** [https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git](https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git)
- **URL por extenso:** `https://github.com/LucasSantos-00/Trabalho-de-progama-ao-para-internet.git`

### Estrutura Principal do Projeto

- `public/data/servicos.json`: catálogo local com **12 serviços automotivos** (identificador, título, descrição, categoria, preço base, tempo estimado e disponibilidade).
- `public/images/`: imagens locais da oficina servidas diretamente pela pasta pública.
- `src/app/core/services/servicoService/servico.service.ts`: serviço responsável pela leitura assíncrona do JSON via `fetch` (`async/await`), filtragem, ordenação e cálculo de resumo dos serviços.
- `src/app/core/services/apiService/api.service.ts`: serviço responsável pelo CRUD de solicitações de orçamento no cliente (`listarOrcamentos`, `submitOrcamento`, `atualizarOrcamento`, `excluirOrcamento`, `limparOrcamentos` e `calcularResumo`), com persistência opcional em `localStorage`.
- `src/app/core/utils/validacao-orcamento.util.ts`: módulo puro de validação (`validarOrcamento`) com regras específicas de negócio.
- `src/app/shared/components/formulario/`: formulário reativo/template-driven de solicitação e painel de gerenciamento das solicitações cadastradas, com máscara de telefone via `ngx-mask`.
- `src/app/views/pages/home/`: página principal que integra a apresentação da oficina, o catálogo dinâmico de serviços e o módulo de orçamento/CRUD.

---

## 3. Funcionalidades Implementadas

### 3.1. Base Existente (HTML Semântico, Navegação e Responsividade)

Foram preservados os elementos estruturais e semânticos (`header`, `nav`, `main`, `section`, `article`, `footer`), a navegação por âncoras entre seções (`#inicio`, `#servicos`, `#sobre`, `#orcamento`, `#contato`), o botão flutuante de retorno ao topo e o layout responsivo adaptado para desktops, tablets e smartphones.

### 3.2. Validação Aprimorada e Máscara de Entrada

Em `src/app/core/utils/validacao-orcamento.util.ts`, a função `validarOrcamento` aplica validações específicas com mensagens claras por campo e bloqueio do envio em caso de inconsistência:

1. **Intervalo de datas e dias de funcionamento:** impede o agendamento de datas anteriores ao dia atual e bloqueia agendamentos aos domingos (informando que a oficina atende de segunda a sábado).
2. **Campos dependentes:** quando o serviço selecionado é `diagnostico` ou `outro`, torna obrigatório o preenchimento da descrição detalhada com no mínimo **15 caracteres**.
3. **Verificação de duplicidade:** impede o cadastro duplicado de solicitações com a mesma combinação de **veículo + serviço + data** (ignorando o próprio registro durante uma edição).
4. **Validação de formato e preenchimento:** valida nome completo (mín. 3 caracteres), e-mail válido, modelo do veículo (mín. 3 caracteres) e telefone com DDD (10 ou 11 dígitos numéricos).
5. **Máscara de telefone com `ngx-mask`:** no campo `#telefone` (`src/app/shared/components/formulario/formulario.component.html`), utiliza-se `NgxMaskDirective` com `mask="(00) 00000-0000||(00) 0000-0000"`, `inputmode="numeric"` e `[dropSpecialCharacters]="false"`, aceitando tanto telefone fixo quanto celular no padrão brasileiro.

### 3.3. Gerenciamento de Registros (CRUD no Cliente)

No componente `FormularioComponent` integrado ao `ApiService`:

- **Inclusão (Create):** ao passar pelas validações, o orçamento é adicionado à lista em memória (e salvo no `localStorage`) com atualização imediata do DOM sem recarregar a página.
- **Listagem (Read):** os registros são exibidos dinamicamente em cards/itens abaixo do formulário, mostrando cliente, veículo, serviço, valor estimado, telefone e data.
- **Edição (Update):** o botão **Editar** carrega os dados do registro no formulário, ativa o indicador visual de edição (`idEmEdicao`) e permite salvar alterações ou cancelar.
- **Exclusão (Delete):** permite remover um registro individualmente (`excluirRegistro`) ou limpar toda a lista (`limparTodosRegistros`), recalculando os totais na hora.

### 3.4. Consulta, Organização e Resumo Calculado

- **Catálogo de serviços (`ServicoService`):** suporta busca textual por título/descrição/categoria, filtro por categoria, ordenação (`padrão`, `nome A-Z`, `menor preço`, `maior preço`) e cálculo de resumo (`total`, `disponíveis` e `preço médio`).
- **Lista de solicitações (`FormularioComponent`):** suporta busca por nome/veículo/telefone/descrição, filtro por tipo de serviço, ordenação (`mais recentes`, `nome A-Z`, `maior valor estimado`) e resumo calculado (`totalRegistros` e `valorTotalEstimado`).

### 3.5. Comunicação Assíncrona com `fetch` e `async/await`

O método `carregarServicos` (`src/app/core/services/servicoService/servico.service.ts`) utiliza `fetch('/data/servicos.json')` com `async/await` para carregar os **12 serviços** locais. O componente `HomeComponent` controla explicitamente os três estados exigidos:

- **Carregamento:** exibição de indicador visual (`carregandoServicos = true`) enquanto aguarda a resposta.
- **Sucesso:** renderização dinâmica dos cards de serviço e disponibilização das opções no `<select>` do formulário.
- **Erro HTTP/Rede:** captura de exceções (ex.: HTTP 404 ou falha de rede) com exibição de mensagem amigável de erro (`estado-erro`) e botão para tentar novamente.

---

## 4. Testes e Resultados

Os cenários abaixo foram planejados e verificados na interface e na suíte automatizada de testes unitários com **Vitest** (`npx ng test --watch=false`), na qual todos os **9 arquivos de teste (28 testes)** foram aprovados, além da compilação de produção (`npx ng build`) concluída sem erros.

| Caso | Cenário Testado | Entrada / Ação | Resultado Esperado e Obtido |
| :--- | :--- | :--- | :--- |
| **CT-01** | **Inclusão de registro (CRUD)** | Preencher formulário válido (nome, e-mail, telefone `(27) 99999-9999`, veículo, serviço, data útil) e enviar | Registro incluído na lista, resumo atualizado (`totalRegistros = 1`) e formulário resetado sem recarregar a página. |
| **CT-02** | **Edição de registro (CRUD)** | Clicar em **Editar** em um item salvo, alterar o nome do cliente e clicar em **Salvar alterações** | Registro atualizado no DOM e no `localStorage`, saindo do modo de edição (`idEmEdicao = null`). |
| **CT-03** | **Exclusão de registro (CRUD)** | Clicar em **Excluir** em um item da lista de solicitações | Item removido imediatamente do DOM e resumo financeiro recalculado. |
| **CT-04** | **Filtro dinâmico e ordenação** | Digitar termo no campo de busca e alternar filtro de categoria/serviço e critério de ordenação | Lista filtrada e reordenada em tempo real; ao limpar filtros, todos os registros voltam a ser exibidos. |
| **CT-05** | **Validação aprovada** | Informar telefone completo com DDD, data futura entre segunda e sábado e descrição >= 15 chars para `diagnostico` | `validarOrcamento` retorna `valido: true`, sem mensagens de erro, liberando o envio. |
| **CT-06** | **Validação reprovada** | Enviar data passada ou domingo, telefone incompleto (`123`), `diagnostico` com descrição curta ou registro duplicado | Envio bloqueado; mensagens específicas exibidas em cada campo inválido e foco no feedback de erro. |
| **CT-07** | **Fetch com sucesso (`async/await`)** | Carregar a página inicial consultando `/data/servicos.json` (status HTTP 200) | Estado de carregamento finalizado e **12 serviços** renderizados dinamicamente no DOM. |
| **CT-08** | **Fetch com falha (erro HTTP/rede)** | Simular resposta HTTP 404 ou rejeição de rede na chamada `fetch` | Estado de erro exibido no DOM (`.estado-erro`) com mensagem descritiva e opção de nova tentativa. |
| **CT-09** | **Responsividade (celular) e navegação por teclado** | Redimensionar viewport para tela mobile (~375 px) e navegar pelos links, campos, `<select>` e botões usando apenas `Tab`, `Shift+Tab` e `Enter` | Layout reorganizado em coluna única sem quebra horizontal; todos os controles interativos recebem foco visível e operam normalmente via teclado. |

> **Espaço para Capturas de Tela (inserir no documento final antes de gerar o PDF):**  
> - *Figura 1:* Tela inicial e catálogo de serviços carregado via JSON.  
> - *Figura 2:* Formulário com máscara de telefone (`ngx-mask`) e validação reprovada exibindo mensagens específicas.  
> - *Figura 3:* Listagem CRUD com edição/exclusão, filtro ativo e resumo calculado.  
> - *Figura 4:* Simulação de erro no `fetch` e visualização responsiva em tela de celular (DevTools).

---

## 5. Conclusão

A evolução do projeto **Oficina Serra** atendeu integralmente aos requisitos propostos para o 2º bimestre, unindo uma base HTML/CSS responsiva e acessível a uma camada completa de lógica no cliente. A implementação de carregamento assíncrono via `fetch` com `async/await`, aliada ao tratamento de estados de carregamento/erro, às regras de validação de negócio com máscara de entrada (`ngx-mask`) e ao CRUD interativo com filtros e resumos calculados, proporcionou uma aplicação funcional, testada e de fácil manutenção.

---

## 6. Referências

ANGULAR. **Angular Documentation**. Disponível em: https://angular.dev/. Acesso em: 12 nov. 2026.

MDN WEB DOCS. **Using the Fetch API**. Mozilla Foundation. Disponível em: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch. Acesso em: 12 nov. 2026.

MDN WEB DOCS. **Client-side form validation**. Mozilla Foundation. Disponível em: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation. Acesso em: 12 nov. 2026.

NGX-MASK. **Angular Mask Directive (`ngx-mask`)**. GitHub / npm. Disponível em: https://www.npmjs.com/package/ngx-mask. Acesso em: 12 nov. 2026.

