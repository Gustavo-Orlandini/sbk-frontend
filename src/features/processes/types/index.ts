/**
 * Types based on API DTOs
 * These types must reflect exactly the contracts defined in Swagger/OpenAPI
 * The backend already transforms the data, so these are the final DTOs
 */

// Raw API response types
export interface ApiProcessesListResponse {
    items: ApiProcessListItem[];
    nextCursor?: string;
}

export interface ApiProcessListItem {
    numeroProcesso: string;
    siglaTribunal: string;
    grauAtual: 'G1' | 'G2' | 'SUP';
    classePrincipal: string | null; // object nullable according to OpenAPI
    assuntoPrincipal: string | null; // object nullable according to OpenAPI
    ultimoMovimento: {
        dataHora: string;
        descricao: string;
        orgaoJulgador: string | null; // object nullable according to OpenAPI
    } | null; // Can be null if process has no movements
    partesResumo: {
        ativo: string[];
        passivo: string[];
    };
}

export interface ApiProcessDetailResponse {
    numeroProcesso: string;
    siglaTribunal: string;
    nivelSigilo: number;
    tramitacaoAtual: {
        grau: 'G1' | 'G2' | 'SUP';
        orgaoJulgador: string | null; // object nullable according to OpenAPI
        classes: string[];
        assuntos: string[];
        dataDistribuicao: string | null; // object nullable according to OpenAPI
        dataAutuacao: string | null; // object nullable according to OpenAPI
    };
    partes: ApiParte[];
    ultimoMovimento: {
        data: string;
        descricao: string;
        orgaoJulgador: string | null; // object nullable according to OpenAPI
        codigo: string | null; // object nullable according to OpenAPI
    } | null; // nullable according to OpenAPI
}

export interface ApiParte {
    nome: string;
    polo: 'ativo' | 'passivo'; // According to OpenAPI, only 'ativo' or 'passivo'
    tipoParte: string | null; // object nullable according to OpenAPI
    representantes: ApiRepresentante[]; // Limited to 5 according to OpenAPI
}

export interface ApiRepresentante {
    nome: string;
    tipo: string | null; // object nullable according to OpenAPI
}

// Frontend types (simplified for UI)
export interface Movimento {
    id: string;
    data: string;
    descricao: string;
    tipo: string; // código do movimento
    orgaoJulgador?: string;
    codigo?: string;
}

export interface Tramitacao {
    id: string;
    local: string; // orgaoJulgador
    status: string;
    data?: string; // dataDistribuicao
    dataAutuacao?: string;
}

export interface Process {
    id: string;
    numero: string;
    tribunal: string;
    nivelSigilo: number;
    grau: 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR';
    classes: string[];
    assuntos: string[];
    classePrincipal: string; // First class for backward compatibility
    assuntoPrincipal: string; // First subject for backward compatibility
    ultimoMovimento: Movimento;
    movimentos: Movimento[];
    partes: SimplifiedParte[];
    tramitacaoAtual: Tramitacao;
    dataDistribuicao: string;
    dataAutuacao: string;
}

export interface SimplifiedParte {
    id: string;
    nome: string;
    tipo: 'ATIVO' | 'PASSIVO';
    tipoParte: string; // e.g., "APELADO", "APELANTE", "AUTOR", "RÉU/RÉ"
    representantes: Representante[];
    documento?: string;
}

export interface Representante {
    id: string;
    nome: string;
    tipo: string; // e.g., "ADVOGADO"
}

export interface ProcessListItem {
    id: string;
    numero: string;
    tribunal: string;
    grau: 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR';
    classePrincipal: string;
    assuntoPrincipal: string;
    ultimoMovimento: {
        data: string;
        descricao: string;
    } | null; // Can be null if process has no movements
}

export interface ProcessesListParams {
    q?: string; // Textual search (number, parties, class, subject)
    tribunal?: string;
    grau?: 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR';
    cursor?: string;
    limit?: number;
}

// Frontend response structure (after mapping)
export interface ProcessesListResponse {
    data: ProcessListItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export interface TribunalOption {
    value: string;
    label: string;
}
