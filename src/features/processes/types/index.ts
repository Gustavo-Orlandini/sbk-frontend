export interface ApiProcessesListResponse {
    items: ApiProcessListItem[];
    nextCursor?: string;
}

export interface ApiProcessListItem {
    numeroProcesso: string;
    siglaTribunal: string;
    grauAtual: 'G1' | 'G2' | 'SUP';
    classePrincipal: string | null;
    assuntoPrincipal: string | null;
    ultimoMovimento: {
        dataHora: string;
        descricao: string;
        orgaoJulgador: string | null;
    } | null;
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
        orgaoJulgador: string | null;
        classes: string[];
        assuntos: string[];
        dataDistribuicao: string | null;
        dataAutuacao: string | null;
    };
    partes: ApiParte[];
    ultimoMovimento: {
        data: string;
        descricao: string;
        orgaoJulgador: string | null;
        codigo: string | null;
    } | null;
}

export interface ApiParte {
    nome: string;
    polo: 'ativo' | 'passivo';
    tipoParte: string | null;
    representantes: ApiRepresentante[];
}

export interface ApiRepresentante {
    nome: string;
    tipo: string | null;
}
export interface Movimento {
    id: string;
    data: string;
    descricao: string;
    tipo: string;
    orgaoJulgador?: string;
    codigo?: string;
}

export interface Tramitacao {
    id: string;
    local: string;
    status: string;
    data?: string;
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
    classePrincipal: string;
    assuntoPrincipal: string;
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
    tipoParte: string;
    representantes: Representante[];
    documento?: string;
}

export interface Representante {
    id: string;
    nome: string;
    tipo: string;
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
    } | null;
}

export interface ProcessesListParams {
    q?: string;
    tribunal?: string;
    grau?: 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR';
    cursor?: string;
    limit?: number;
}
export interface ProcessesListResponse {
    data: ProcessListItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export interface TribunalOption {
    value: string;
    label: string;
}
