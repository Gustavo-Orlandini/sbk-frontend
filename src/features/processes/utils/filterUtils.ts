import type { ProcessListItem } from '../types';
import { isCompleteProcessNumber, isValidProcessNumber } from './processNumberUtils';

export interface FilterProcessesParams {
    processList: ProcessListItem[];
    search?: string;
    keywordSearch?: string;
}

export const filterProcesses = ({
    processList,
    search = '',
    keywordSearch = '',
}: FilterProcessesParams): ProcessListItem[] => {
    let filtered = processList;

    if (isCompleteProcessNumber(search) && isValidProcessNumber(search)) {
        const searchNormalized = search.trim().toLowerCase();
        filtered = filtered.filter((process) =>
            process.numero.toLowerCase().includes(searchNormalized)
        );
    }

    if (keywordSearch.trim()) {
        const keywordNormalized = keywordSearch.trim().toLowerCase();
        filtered = filtered.filter((process) => {
            const searchableText = [
                process.numero,
                process.tribunal,
                process.classePrincipal,
                process.assuntoPrincipal,
                process.ultimoMovimento?.descricao || '',
                process.grau,
            ]
                .join(' ')
                .toLowerCase();

            return searchableText.includes(keywordNormalized);
        });
    }

    return filtered;
};
