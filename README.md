# Oficina Serra - Serviços Automotivos

Aplicação web desenvolvida em **Angular 21** (`@angular/cli` 21.1.2) para apresentação dos serviços automotivos da **Oficina Serra**, consulta dinâmica de catálogo e gerenciamento completo de solicitações de orçamento no navegador.

## Funcionalidades

1. **Catálogo de Serviços Assíncrono (`fetch` + `async/await`)**
   - Catálogo com **12 serviços automotivos** em `public/data/servicos.json`.
   - Leitura assíncrona via `ServicoService.carregarServicos()` com tratamento dos estados de **carregamento**, **sucesso** e **erro HTTP/rede** (com opção de tentar novamente).
   - Busca textual, filtro por categoria, ordenação (padrão, nome A–Z, menor preço e maior preço) e resumo calculado (quantidade exibida, serviços disponíveis e preço médio estimado).
2. **Validação de Regras de Negócio**
   - Implementada em `src/app/core/utils/validacao-orcamento.util.ts`:
     - **Intervalo de datas e funcionamento:** impede datas anteriores ao dia atual e agendamentos aos domingos (funcionamento de segunda a sábado).
     - **Campos dependentes:** exige descrição detalhada com pelo menos 15 caracteres para os serviços `Diagnóstico` e `Outro`.
     - **Duplicidade e formato:** bloqueia solicitações duplicadas para o mesmo veículo, serviço e data, além de validar nome completo, e-mail e telefone com DDD (10 ou 11 dígitos).
3. **Gerenciamento de Orçamentos (CRUD no Cliente)**
   - Inclusão, listagem, edição e exclusão de solicitações em `FormularioComponent` e `ApiService`, com persistência em `localStorage` e atualização imediata da interface sem recarregar a página.
4. **Consulta, Organização e Resumo de Orçamentos**
   - Busca dinâmica por cliente, veículo ou serviço, filtro por tipo de serviço, ordenação por múltiplos critérios e painel com resumo calculado (total de orçamentos, valor total estimado e ticket médio).

## Estrutura de Pastas

- `public/` — Recursos estáticos públicos (`css/splash-screen.css`, `data/servicos.json`, `images/`, `favicon.png`)
- `src/styles/` — Estilos modulares SCSS (`_variables.scss`, `_reboot.scss`, `_navbar.scss`, `_layouts.scss`, `components/`, `mixins/`)
- `src/app/core/` — Configurações (`config/`), serviços (`services/apiService/`, `services/servicoService/`), tipos (`types/`), diretivas (`directives/`), guards (`guards/`), interceptors (`interceptors/`) e utilitários (`utils/`)
- `src/app/shared/` — Componentes compartilhados (`components/formulario/`)
- `src/app/views/` — Layout (`layout/base/`, `layout/navbar/`, `layout/footer/`) e páginas (`pages/home/`, `pages/error/`)

## Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   Ou diretamente pelo Angular CLI:
   ```bash
   npx ng serve
   ```
3. Acesse no navegador: `http://localhost:4200/`

## Build de Produção e Testes

- **Build de produção:**
  ```bash
  npx ng build
  ```
  Os arquivos compilados são gerados em `dist/oficina-serra/browser/`.
- **Testes unitários (Vitest):**
  ```bash
  npx ng test --watch=false
  ```
