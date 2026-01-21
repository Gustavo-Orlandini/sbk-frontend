# 🏛️ SBK Frontend - Sistema de Gestão de Processos Jurídicos

<div align="center">

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
![Material UI](https://img.shields.io/badge/Material%20UI-5.14-blue?logo=mui)

**Aplicação web moderna e responsiva para consulta e gestão de processos jurídicos**

[✨ Funcionalidades](#-funcionalidades) • [🚀 Tecnologias](#-tecnologias) • [📋 Pré-requisitos](#-pré-requisitos) • [⚙️ Instalação](#️-instalação) • [🏗️ Arquitetura](#️-arquitetura)

</div>

---

## 📖 Sobre o Projeto

O **SBK Frontend** é uma aplicação React moderna desenvolvida para consumo de uma API REST de processos jurídicos. O sistema oferece uma interface intuitiva e responsiva para consulta, busca avançada e visualização detalhada de processos judiciais, com suporte completo a filtros, paginação e modo escuro/claro.

### 🎯 Principais Destaques

- ✅ **Arquitetura escalável** baseada em features, facilitando manutenção e extensão
- ✅ **TypeScript** para type-safety e melhor experiência de desenvolvimento
- ✅ **Material UI** para interface consistente e profissional
- ✅ **Paginação eficiente** com cursor-based pagination
- ✅ **Busca inteligente** com filtros locais e remotos
- ✅ **Dark/Light mode** com persistência de preferências
- ✅ **Tratamento robusto de erros** com estados visuais informativos
- ✅ **Performance otimizada** com debounce e lazy loading

---

## ✨ Funcionalidades

### 🔍 Listagem de Processos

- **Busca Simples e Avançada**
  - Busca por palavras-chave com filtro local inteligente
  - Busca por número de processo com validação e máscara automática
  - Busca avançada via API com parâmetros combinados
  - Filtros por Tribunal e Grau (Primeiro, Segundo, Superior)
  - Debounce de 800ms para otimizar requisições
  - Destaque visual de filtros ativos

- **Exibição Otimizada**
  - Grid responsivo (2 colunas em desktop)
  - Cards informativos com chips coloridos para grau
  - Exibição de último movimento quando disponível
  - Estados de loading, erro e vazio bem tratados

- **Paginação Avançada**
  - Paginação baseada em cursor para performance
  - Seleção customizável de itens por página (10, 20, 30, 50, 100)
  - Botão "Carregar mais" para navegação progressiva
  - Sincronização automática entre filtros e paginação

### 📄 Detalhamento de Processo

- **Informações Completas**
  - Cabeçalho com número, tribunal, nível de sigilo e grau
  - Tramitação atual com órgão julgador, classes e assuntos
  - Datas de distribuição e autuação
  - Último movimento com órgão julgador e código

- **Partes do Processo**
  - Separação por polo (Ativo/Passivo)
  - Ordenação alfabética automática
  - Representantes em accordion para melhor organização
  - Paginação quando há mais de 10 itens (configurável de 1 a 100)

### 🎨 Experiência do Usuário

- **Tema Adaptável**
  - Modo claro e escuro
  - Persistência de preferência no localStorage
  - Respeito à preferência do sistema
  - Transições suaves entre temas

- **Feedback Visual**
  - Notificações toast não intrusivas (centro inferior)
  - Estados de loading com spinners informativos
  - Tratamento de erros com opção de retry
  - Mensagens descritivas para estados vazios

---

## 🚀 Tecnologias

### Core
- **React 18.2** - Biblioteca UI com hooks modernos
- **TypeScript 5.2** - Type-safety e melhor DX
- **Vite 5.0** - Build tool rápido e otimizado

### UI/UX
- **Material UI 5.14** - Componentes profissionais e acessíveis
- **Emotion** - CSS-in-JS para estilização
- **React Router DOM 6.20** - Roteamento declarativo

### Estado e Dados
- **Axios 1.6** - Cliente HTTP com interceptors
- **Notistack 3.0** - Sistema de notificações toast
- **React Hooks** - Gerenciamento de estado local

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **TypeScript ESLint** - Regras específicas para TS
- **Vite Plugin React** - Suporte otimizado ao React

---

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm**, **yarn** ou **pnpm**
- API backend NestJS rodando (padrão: `http://localhost:3000`)

---

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Gustavo-Orlandini/sbk-frontend.git
cd sbk-frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000/
```

> **⚠️ Importante:** A URL deve terminar com `/` (barra final). O arquivo `.env` não é versionado por questões de segurança.

### 4. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🏗️ Arquitetura

### Estrutura de Pastas (Feature-Based)

```
src/
├── features/                    # Módulos de funcionalidades
│   └── processes/              # Feature: Processos Jurídicos
│       ├── api/                # Cliente API e mappers
│       ├── components/         # Componentes específicos
│       ├── hooks/              # Hooks customizados
│       ├── pages/              # Páginas/rotas
│       ├── types/              # Interfaces TypeScript
│       └── utils/              # Utilitários da feature
│
├── shared/                     # Código compartilhado
│   ├── api/                    # Cliente HTTP base
│   ├── components/             # Componentes reutilizáveis
│   ├── contexts/               # Contextos React
│   ├── hooks/                  # Hooks compartilhados
│   └── theme/                  # Configuração de temas
│
├── App.tsx                     # Componente raiz e rotas
└── main.tsx                    # Ponto de entrada
```

### 🎯 Decisões Arquiteturais

#### 1. Feature-Based Architecture
- **Isolamento de responsabilidades**: Cada feature é auto-contida
- **Escalabilidade**: Adição de novas features sem impacto
- **Colocação**: Código relacionado agrupado logicamente
- **Manutenibilidade**: Fácil localização e modificação

#### 2. Type-Safe API Integration
- Interfaces TypeScript refletem contratos da API
- Type-safety em tempo de compilação
- Prevenção de erros de runtime
- Facilita refatorações seguras

#### 3. Custom Hooks para Data Fetching
- **`useProcesses`**: Listagem com paginação e filtros
- **`useProcess`**: Detalhe de processo individual
- **`useProcessesFilters`**: Lógica complexa de filtros e debounce
- **`useAvailableTribunals`**: Busca otimizada de tribunais

Benefícios:
- Lógica reutilizável
- Componentes focados em apresentação
- Fácil teste isolado
- Tratamento consistente de erros

#### 4. API Client Centralizado
- Instância Axios configurada centralmente
- Tratamento unificado de erros
- Base URL configurável por ambiente
- Preparado para interceptors (auth, logging)

#### 5. Componentização Inteligente
- Componentes pequenos e focados
- Separação de lógica e apresentação
- Reutilização máxima de código
- Estados explícitos (loading, error, empty)

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build otimizado
npm run preview      # Preview da build de produção

# Qualidade
npm run lint         # Executa ESLint
```

---

## 📚 Funcionalidades Técnicas Detalhadas

### Busca e Filtros

**Modo Simples:**
- Filtro local para digitação rápida
- Migração automática para API quando número completo ou palavras-chave são inseridas
- Validação de formato de número de processo em tempo real
- Debounce de 800ms para otimização de requisições

**Modo Avançado:**
- Busca textual completa via API
- Combinação de múltiplos filtros
- Botão dedicado para acionar busca
- Query parameters otimizados

### Paginação

- **Cursor-based pagination** para performance
- Suporte a diferentes tamanhos de página (10-100)
- Sincronização entre filtros e resultados
- "Carregar mais" progressivo sem recarregar página

### Tratamento de Dados

- **Mappers dedicados** para transformação de DTOs
- Tratamento robusto de campos nullable
- Validação e sanitização de inputs
- Formatação consistente de datas e números

---

## 🎨 Design System

### Temas

- **Light Mode**: Background `#e8e8e8`, cores suaves
- **Dark Mode**: Background `#121212`, alto contraste
- **Persistência**: LocalStorage + preferência do sistema
- **Transições**: Suaves entre temas

### Componentes Visuais

- Chips coloridos para graus (Azul/Roxo/Laranja)
- Bordas destacadas em filtros ativos
- Cards com hover effects
- Grid responsivo adaptável

---

## 🔌 Integração com API

### Endpoints Utilizados

- `GET /lawsuits` - Lista processos com filtros e paginação
- `GET /lawsuits/:caseNumber` - Detalhe completo do processo

### Formato de Dados

- **Grau**: Conversão automática `G1/G2/SUP` ↔ `PRIMEIRO/SEGUNDO/SUPERIOR`
- **Números**: Máscara `XXXXXXX-XX.YYYY.X.XX.XXXX`
- **Datas**: Formatação brasileira `DD/MM/YYYY HH:mm`
- **Nullables**: Tratamento seguro de campos opcionais

---

## 🚧 Melhorias Futuras

- [ ] Testes unitários e de integração (Jest + React Testing Library)
- [ ] Cache de requisições (React Query ou SWR)
- [ ] Autenticação e autorização
- [ ] Internacionalização (i18n)
- [ ] PWA com service workers
- [ ] Exportação de dados (PDF/CSV)
- [ ] Filtros salvos/favoritos
- [ ] Notificações em tempo real

---

## 📝 Padrões de Código

- **Componentes**: Funcionais com hooks
- **Nomenclatura**: PascalCase (componentes), camelCase (funções)
- **Tipos**: Interfaces para objetos, types para unions
- **Imports**: Path aliases (`@/shared/...`) para absolutos
- **Exports**: Named exports preferidos
- **Hooks**: Convenção `use*` para todos os hooks customizados

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 👤 Autor

**Gustavo Orlandini**

- GitHub: [@Gustavo-Orlandini](https://github.com/Gustavo-Orlandini)
- Repositório: [sbk-frontend](https://github.com/Gustavo-Orlandini/sbk-frontend)

---

