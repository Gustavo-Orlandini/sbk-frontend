import type {
    ApiProcessesListResponse,
    ApiProcessListItem,
    ApiProcessDetailResponse,
    ApiParte,
    ApiRepresentante,
    ProcessListItem,
    Process,
    ProcessesListResponse,
    SimplifiedParte,
    Representante,
} from '../types';

const mapGrau = (grauAtual: 'G1' | 'G2' | 'SUP'): 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR' => {
    if (grauAtual === 'G1') return 'PRIMEIRO';
    if (grauAtual === 'G2') return 'SEGUNDO';
    return 'SUPERIOR';
};

export const mapApiItemToListItem = (item: ApiProcessListItem, index: number): ProcessListItem => {
    return {
        id: `${item.numeroProcesso}-${index}`,
        numero: item.numeroProcesso,
        tribunal: item.siglaTribunal,
        grau: mapGrau(item.grauAtual),
        classePrincipal: item.classePrincipal || '',
        assuntoPrincipal: item.assuntoPrincipal || '',
        ultimoMovimento: item.ultimoMovimento
            ? {
                data: item.ultimoMovimento.dataHora,
                descricao: item.ultimoMovimento.descricao,
            }
            : null,
    };
};

export const mapProcessesListResponse = (
    apiResponse: ApiProcessesListResponse
): ProcessesListResponse => {
    const data = apiResponse.items.map((item, index) => mapApiItemToListItem(item, index));
    const hasMore = !!apiResponse.nextCursor;

    return {
        data,
        nextCursor: apiResponse.nextCursor,
        hasMore,
    };
};

const mapApiRepresentante = (representante: ApiRepresentante, index: number): Representante => {
    return {
        id: `representante-${index}-${representante.nome}`,
        nome: representante.nome,
        tipo: representante.tipo || '',
    };
};

const mapApiParte = (parte: ApiParte, index: number): SimplifiedParte => {
    const tipo: 'ATIVO' | 'PASSIVO' = parte.polo === 'ativo' ? 'ATIVO' : 'PASSIVO';

    return {
        id: `${parte.polo}-${index}-${parte.nome}`,
        nome: parte.nome,
        tipo,
        tipoParte: parte.tipoParte || '',
        representantes: parte.representantes.map((rep, repIndex) => mapApiRepresentante(rep, repIndex)),
    };
};

export const mapApiDetailToProcess = (apiResponse: ApiProcessDetailResponse): Process => {
    const ultimoMovimento = apiResponse.ultimoMovimento
        ? {
            id: `movimento-${apiResponse.numeroProcesso}-${apiResponse.ultimoMovimento.codigo || 'last'}`,
            data: apiResponse.ultimoMovimento.data,
            descricao: apiResponse.ultimoMovimento.descricao,
            tipo: apiResponse.ultimoMovimento.codigo || '',
            orgaoJulgador: apiResponse.ultimoMovimento.orgaoJulgador || undefined,
            codigo: apiResponse.ultimoMovimento.codigo || undefined,
        }
        : {
            id: `movimento-${apiResponse.numeroProcesso}-last`,
            data: '',
            descricao: 'Sem movimentos registrados',
            tipo: '',
            orgaoJulgador: undefined,
            codigo: undefined,
        };

    return {
        id: apiResponse.numeroProcesso,
        numero: apiResponse.numeroProcesso,
        tribunal: apiResponse.siglaTribunal,
        nivelSigilo: apiResponse.nivelSigilo,
        grau: mapGrau(apiResponse.tramitacaoAtual.grau),
        classes: apiResponse.tramitacaoAtual.classes || [],
        assuntos: apiResponse.tramitacaoAtual.assuntos || [],
        classePrincipal: apiResponse.tramitacaoAtual.classes[0] || '',
        assuntoPrincipal: apiResponse.tramitacaoAtual.assuntos[0] || '',
        ultimoMovimento,
        movimentos: apiResponse.ultimoMovimento ? [ultimoMovimento] : [],
        partes: apiResponse.partes.map((parte, index) => mapApiParte(parte, index)),
        tramitacaoAtual: {
            id: `tramitacao-${apiResponse.numeroProcesso}`,
            local: apiResponse.tramitacaoAtual.orgaoJulgador || '',
            status: 'Em Tramitação',
            data: apiResponse.tramitacaoAtual.dataDistribuicao || undefined,
            dataAutuacao: apiResponse.tramitacaoAtual.dataAutuacao || undefined,
        },
        dataDistribuicao: apiResponse.tramitacaoAtual.dataDistribuicao || '',
        dataAutuacao: apiResponse.tramitacaoAtual.dataAutuacao || '',
    };
};
