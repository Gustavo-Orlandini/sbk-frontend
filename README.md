# SBK - Frontend de Processos Jurídicos

Aplicação frontend React desenvolvida com Vite, TypeScript e Material UI para consumo de API REST de processos jurídicos desenvolvida em NestJS.

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada em features, priorizando separação de responsabilidades, tipagem forte e código limpo.

### Estrutura de Diretórios

```
src/
├── features/                    # Funcionalidades específicas do domínio
│   └── processes/
│       ├── api/                 # Cliente API específico da feature
│       │   ├── mappers.ts       # Transformação de dados da API para o frontend
│       │   └── processesApi.ts  # Cliente API para processos
│       ├── hooks/               # Hooks customizados para data fetching
│       │   ├── useProcess.ts    # Hook para buscar processo individual
│       │   └── useProcesses.ts  # Hook para listagem com paginação
│       ├── components/          # Componentes específicos da feature
│       │   ├── ProcessDetail.tsx        # Detalhes completos do processo
│       │   ├── ProcessListItem.tsx      # Card de processo na listagem
│       │   ├── ProcessesFilters.tsx     # Componente de filtros e busca
│       │   └── ProcessesList.tsx        # Listagem de processos
│       ├── pages/               # Páginas/rotas da feature
│       │   ├── ProcessDetailPage.tsx    # Página de detalhes
│       │   └── ProcessesListPage.tsx    # Página de listagem
│       ├── types/               # Tipos/interfaces específicos da feature
│       │   └── index.ts         # Todas as interfaces TypeScript
│       └── utils/               # Utilitários da feature
│           ├── dateUtils.ts            # Formatação de datas
│           ├── filterUtils.ts          # Lógica de filtros locais
│           └── processNumberUtils.ts   # Validação e máscara de números
│
├── shared/                      # Código compartilhado entre features
│   ├── api/                     # Cliente API base e utilitários
│   │   └── client.ts            # Instância Axios configurada
│   ├── components/              # Componentes reutilizáveis
│   │   ├── EmptyState.tsx       # Estado vazio
│   │   ├── ErrorState.tsx       # Estado de erro
│   │   ├── LoadingSpinner.tsx   # Spinner de carregamento
│   │   └── ThemeToggle.tsx      # Toggle de tema
│   ├── contexts/                # Contextos React
│   │   └── ThemeContext.tsx     # Contexto de tema (light/dark)
│   ├── hooks/                   # Hooks compartilhados
│   │   └── useToast.ts          # Hook para notificações toast
│   └── theme/                   # Configuração do Material UI Theme
│       └── index.ts             # Temas light e dark
│
├── App.tsx                      # Componente raiz e configuração de rotas
└── main.tsx                     # Ponto de entrada da aplicação
```

## 🎯 Decisões Técnicas

### 1. **Feature-Based Architecture**

A organização baseada em features permite:
- **Isolamento de responsabilidades**: Cada feature é auto-contida
- **Escalabilidade**: Fácil adicionar novas features sem impactar existentes
- **Manutenibilidade**: Fácil localizar e modificar código relacionado
- **Colocação**: Código relacionado fica próximo (api, hooks, components, types, utils)

### 2. **Tipagem Forte Baseada em Contratos**

Todos os tipos em `features/processes/types/index.ts` refletem os DTOs da API:
- Garante type-safety em tempo de compilação
- Facilita refatorações
- Documenta implicitamente os contratos da API
- Previne erros de runtime relacionados a tipos

**IMPORTANTE**: Os tipos devem ser atualizados sempre que o contrato Swagger/OpenAPI da API mudar.

### 3. **Hooks Customizados para Data Fetching**

**`useProcesses`** (listagem):
- Gerencia estado de loading, error e dados
- Implementa paginação baseada em cursor
- Permite filtros e busca via API
- Suporta "carregar mais" (append) com quantidade configurável
- Expõe `currentLimit` para sincronização de estado

**`useProcess`** (detalhe):
- Fetching de processo individual por número
- Retry automático via `refetch`
- Estado isolado por processo

**Benefícios**:
- Lógica de data fetching reutilizável
- Componentes de apresentação sem lógica de negócio
- Fácil testar isoladamente
- Consistência de tratamento de erros

### 4. **API Client Centralizado**

**`shared/api/client.ts`**:
- Instância Axios configurada centralmente
- Base URL via variável de ambiente (`VITE_API_BASE_URL`)
- Função utilitária `handleApiError` para tratamento consistente de erros
- Facilita interceptors futuros (auth, logging, etc.)

**`features/processes/api/processesApi.ts`**:
- Encapsula todas as chamadas de API relacionadas a processos
- Apenas responsável por fazer requisições HTTP
- Não contém lógica de negócio
- Tipado com interfaces da feature
- Mapeia grau de PRIMEIRO/SEGUNDO/SUPERIOR para G1/G2/SUP

**`features/processes/api/mappers.ts`**:
- Transforma dados da API para formatos do frontend
- Garante consistência na transformação
- Facilita mudanças futuras na API

### 5. **Tratamento Explícito de Estados**

**Componentes Compartilhados**:
- `LoadingSpinner`: Estado de carregamento com mensagem customizável
- `ErrorState`: Erros da API com opção de retry e limpar filtros
- `EmptyState`: Estado vazio com mensagem e descrição descritivas

**Aplicação consistente**:
- Todas as páginas tratam explicitamente loading, error e empty
- UX clara para o usuário
- Fácil debug

### 6. **Material UI para UI**

**Decisões**:
- Theme centralizado em `shared/theme`
- Suporte a tema light e dark
- Background light: `#e8e8e8` (cinza claro)
- Background dark: `#121212` (preto)
- Componentes do MUI para consistência visual
- Layout responsivo com Grid system
- Feedback visual simples e profissional
- Toast notifications (notistack) posicionadas no centro inferior

### 7. **Sistema de Temas**

**`shared/contexts/ThemeContext.tsx`**:
- Contexto global para gerenciamento de tema
- Suporte a light e dark mode
- Persistência da preferência do usuário no localStorage
- Respeita preferência do sistema (prefers-color-scheme)
- Componente `ThemeToggle` para alternância manual

**Temas configurados**:
- Light: Background cinza claro, texto escuro
- Dark: Background escuro, texto claro
- Cores de acento (primary, secondary, warning, error, success, info) configuradas para ambos

### 8. **Variáveis de Ambiente**

**`.env`**:
```env
VITE_API_BASE_URL=http://localhost:3000/
```

- Base URL configurável por ambiente
- Segue convenção do Vite (`VITE_*`)
- `env.example.txt` documenta variáveis necessárias
- **IMPORTANTE**: URL deve terminar com `/` (sem `/api` no final)

**⚠️ Importante:** O arquivo `.env` não será versionado no Git (está no `.gitignore`). Cada desenvolvedor deve criar seu próprio `.env` local.

### 9. **React Router para Navegação**

- Rotas definidas em `App.tsx`
- Navegação declarativa
- URLs semânticas:
  - `/` → redireciona para `/processos`
  - `/processos` → Listagem de processos
  - `/processos/:id` → Detalhes do processo

### 10. **Utilitários Organizados**

**`features/processes/utils/`**:
- `dateUtils.ts`: Formatação de datas (formato completo e apenas data)
- `filterUtils.ts`: Lógica de filtros locais (para busca simples)
- `processNumberUtils.ts`: Validação, máscara e formatação de números de processo

## 📋 Funcionalidades Implementadas

### 1. Listagem de Processos (`/processos`)

#### Busca e Filtros

**Modo de Busca Simples (Local)**:
- ✅ Busca por palavras-chave (filtro local nos processos carregados)
- ✅ Busca por número de processo (com máscara automática)
- ✅ Filtros por Tribunal e Grau (PRIMEIRO, SEGUNDO, SUPERIOR)
- ✅ Filtros combinados funcionam em sincronia
- ✅ Busca por número completo usa API (não apenas filtro local)
- ✅ Busca por palavras-chave usa API quando necessário
- ✅ Validação de formato de número de processo
- ✅ Debounce de 800ms para filtros

**Modo de Busca Avançada (API)**:
- ✅ Busca textual via parâmetro `q` (número, nome das partes, classe, assunto)
- ✅ Filtros por Tribunal e Grau (PRIMEIRO, SEGUNDO, SUPERIOR)
- ✅ Botão "Buscar" para acionar busca na API
- ✅ Filtros combinados via query parameters

**Recursos**:
- ✅ Filtros ativos destacados com borda dourada (dark) ou azul (light)
- ✅ Botão "Limpar filtros" para resetar todos os filtros
- ✅ Lista completa de tribunais disponíveis (extraídos de busca completa de todos os processos, sem limite de páginas)

#### Exibição

- ✅ Lista em grid responsivo (2 colunas por padrão)
- ✅ Cards com informações do processo
- ✅ Campos exibidos:
  - Número do processo
  - Tribunal (sigla)
  - Grau (PRIMEIRO, SEGUNDO, SUPERIOR) com chips coloridos:
    - PRIMEIRO: Azul (primary)
    - SEGUNDO: Roxo (secondary)
    - SUPERIOR: Laranja/âmbar (warning)
  - Classe principal
  - Assunto principal
  - Último movimento (data e descrição) quando disponível
- ✅ Estados: loading, error, empty

#### Paginação

- ✅ Paginação baseada em cursor
- ✅ Botão "Carregar mais" para buscar próximos resultados
- ✅ Seleção de itens por página (10, 20, 30, 50, 100)
- ✅ Botão desaparece quando todos os processos são carregados
- ✅ Sincronização entre seleção de itens e paginação
- ✅ Paginação reflete resultados filtrados corretamente

### 2. Detalhe do Processo (`/processos/:id`)

#### Cabeçalho

- ✅ Número do processo
- ✅ Sigla do tribunal
- ✅ Nível de sigilo (chip colorido)
- ✅ Grau (PRIMEIRO, SEGUNDO, SUPERIOR) com chip colorido

#### Tramitação Atual

- ✅ Órgão julgador
- ✅ Classes (lista)
- ✅ Assuntos (lista)
- ✅ Data de distribuição
- ✅ Data de autuação
- ✅ Status (derivado)

#### Partes

- ✅ Separação por polo (Ativo / Passivo)
- ✅ Ordenação alfabética por nome
- ✅ Informações exibidas:
  - Nome da parte
  - Tipo da parte (AUTOR, RÉU/RÉ, APELANTE, APELADO, PERITO(A), etc.)
- ✅ Representantes em Accordion:
  - Lista de representantes por parte
  - Informações: nome e tipo (ADVOGADO, etc.)
  - Paginação quando há mais de 10 representantes
  - Seleção de itens por página (mínimo 1, máximo 100)

#### Último Movimento

- ✅ Data e descrição
- ✅ Órgão julgador
- ✅ Código do movimento (quando disponível)

#### Estados

- ✅ Loading durante busca
- ✅ Error com opção de retry
- ✅ Navegação de volta para listagem

### 3. Tema Light/Dark

- ✅ Toggle de tema (botão no header quando disponível)
- ✅ Persistência da preferência do usuário
- ✅ Respeita preferência do sistema
- ✅ Transição suave entre temas
- ✅ Cores adaptadas para ambos os temas

### 4. Notificações Toast

- ✅ Notificações via notistack
- ✅ Posicionamento: centro inferior
- ✅ Tipos: success, error, warning, info
- ✅ Duração automática (4s padrão, 6s para erros)
- ✅ Máximo de 3 notificações simultâneas
- ✅ Feedback para ações do usuário (carregar mais, buscar, etc.)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Ou
yarn install

# Ou
pnpm install
```

### Configuração

1. Crie o arquivo `.env` na raiz do projeto (copie de `env.example.txt`):

**No Windows PowerShell:**
```powershell
Copy-Item env.example.txt .env
```

**No Linux/Mac:**
```bash
cp env.example.txt .env
```

**Ou crie manualmente** um arquivo `.env` com o seguinte conteúdo:
```env
VITE_API_BASE_URL=http://localhost:3000/
```

2. Configure a `VITE_API_BASE_URL` apontando para sua API NestJS. Exemplo:
   - Desenvolvimento local: `http://localhost:3000/`
   - Produção: `https://api.seudominio.com/`

**⚠️ Importante:** 
- A URL deve terminar com `/` (barra final)
- Não inclua `/api` no final da URL
- O arquivo `.env` não será versionado no Git (está no `.gitignore`)

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Preview da Build

```bash
npm run preview
```

## 📦 Tecnologias Utilizadas

- **React 18**: Biblioteca UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Material UI (MUI)**: Componentes UI
  - **@mui/material**: Componentes base
  - **@mui/icons-material**: Ícones
  - **@emotion/react** e **@emotion/styled**: Estilização
- **React Router DOM**: Roteamento
- **Axios**: Cliente HTTP
- **Notistack**: Sistema de notificações toast
- **ESLint**: Linting

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento (Vite)
- `npm run build`: Gera build de produção (TypeScript + Vite)
- `npm run preview`: Preview da build de produção
- `npm run lint`: Executa ESLint para verificar código

## 📝 Notas Importantes

### Integração com a API

1. **Contrato Swagger**: Os tipos TypeScript devem refletir exatamente os DTOs da API. Atualize `src/features/processes/types/index.ts` sempre que o Swagger mudar.

2. **Endpoints Esperados** (baseado no OpenAPI `/api/docs-json`):
   - `GET /lawsuits` - Lista processos
     - Query params:
       - `q` (opcional): Busca textual (número, sigla tribunal, nome das partes, classe ou assunto). Se corresponder a padrão de grau (ex: "G1", "G2"), filtra por `grauAtual`
       - `tribunal` (opcional): Sigla do tribunal (ex: "TJSP")
       - `grau` (opcional): Grau do processo (G1, G2, SUP)
       - `limit` (opcional): Número de itens por página (1-100, padrão: 20)
       - `cursor` (opcional): Token de paginação baseado em cursor
     - Response: `{ items: LawsuitSummaryDto[], nextCursor: string | null }`
   - `GET /lawsuits/:caseNumber` - Detalhe de um processo
     - Path param: `caseNumber` (número do processo, ex: "0000001-23.2023.8.26.0100")
     - Response: `LawsuitDetailDto` ou 404 se não encontrado

**Nota sobre Tribunais**: Não existe endpoint dedicado para buscar tribunais. O frontend busca todos os processos (usando paginação com cursor até pegar todos, sem limite de páginas) na inicialização para extrair a lista completa de tribunais únicos disponíveis. Isso garante que o filtro de tribunais mostre todas as opções disponíveis, independentemente de quantos processos existam na base de dados.

3. **Formato de Resposta da API**:

**Lista (`GET /lawsuits`)**:
```typescript
{
  items: LawsuitSummaryDto[],
  nextCursor: string | null
}
```

**Detalhe (`GET /lawsuits/:caseNumber`)**:
```typescript
LawsuitDetailDto {
  numeroProcesso: string;
  siglaTribunal: string;
  nivelSigilo: number;
  tramitacaoAtual: CurrentProceedingDto; // Com campos nullable: orgaoJulgador, dataDistribuicao, dataAutuacao
  partes: PartyDetailDto[]; // Representantes limitados a 5
  ultimoMovimento: LastMovementDetailDto | null; // Com campos nullable: orgaoJulgador, codigo
}
```

**Campos Nullable** (segundo OpenAPI):
- `classePrincipal` e `assuntoPrincipal` em `LawsuitSummaryDto` são `object | null`
- `ultimoMovimento.orgaoJulgador` é `object | null`
- `tramitacaoAtual.orgaoJulgador` é `object | null`
- `tramitacaoAtual.dataDistribuicao` e `dataAutuacao` são `object | null`
- `parte.tipoParte` é `object | null`
- `representante.tipo` é `object | null`
- `ultimoMovimento.codigo` é `object | null`
- `ultimoMovimento` pode ser `null` em `LawsuitDetailDto`

O frontend mapeia as respostas da API para:
```typescript
{
  data: ProcessListItem[],
  nextCursor?: string,
  hasMore: boolean // Calculado baseado em nextCursor
}

Process {
  // Campos mapeados com tratamento de valores nullable
  // Campos nullable convertidos para strings vazias ou undefined quando apropriado
}
```

4. **Formato de Grau**:
   - API usa: `G1`, `G2`, `SUP`
   - Frontend usa: `PRIMEIRO`, `SEGUNDO`, `SUPERIOR`
   - Conversão automática no `processesApi.ts`

5. **Formato de Número de Processo**:
   - Padrão: `XXXXXXX-XX.YYYY.X.XX.XXXX`
   - Exemplo: `5000918-41.2021.8.13.0487`
   - Máscara automática aplicada no input
   - Validação de formato completo

### Lógica de Busca e Filtros

**Busca Simples**:
- Quando há filtros API (tribunal/grau) OU número completo OU palavras-chave: usa API
- Quando não há filtros e busca incompleta: filtro local apenas

**Busca Avançada**:
- Sempre usa API
- Requer botão "Buscar" para acionar

**Sincronização**:
- Todos os filtros funcionam em conjunto
- Paginação reflete resultados filtrados
- Mudanças em filtros resetam paginação

### Extensibilidade Futura

A arquitetura facilita:
- Adicionar novas features (ex: `features/usuarios/`, `features/relatorios/`)
- Implementar autenticação (interceptors no `apiClient`)
- Adicionar testes unitários/integração
- Implementar cache (React Query, SWR)
- Adicionar estado global (Context API, Zustand, Redux) se necessário
- Internacionalização (i18n)

## 🎨 Padrões de Código

- **Componentes**: Funcionais com hooks
- **Nomenclatura**: 
  - PascalCase para componentes
  - camelCase para funções e variáveis
  - kebab-case para arquivos (quando aplicável)
- **Tipos**: 
  - `interface` para objetos
  - `type` para unions/intersections
  - Prefixo `Api` para tipos da API
- **Imports**: 
  - Path aliases (`@/shared/...`) para imports absolutos
  - Imports relativos para arquivos próximos
- **Exports**: Named exports preferidos
- **Hooks**: Todos os hooks seguem a convenção `use*`



---
