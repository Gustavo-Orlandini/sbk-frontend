/**
 * Filter utilities for processes
 */

import type { ProcessListItem } from '../types';
import { isCompleteProcessNumber, isValidProcessNumber } from './processNumberUtils';

export interface FilterProcessesParams {
    processList: ProcessListItem[];
    search?: string;
    keywordSearch?: string;
}

/**
 * Filters processes by process number and/or keyword search
 * @param params - Filter parameters
 * @returns Filtered list of processes
 */
export const filterProcesses = ({
    processList,
    search = '',
    keywordSearch = '',
}: FilterProcessesParams): ProcessListItem[] => {
    let filtered = processList;

    // Filter by process number if complete and valid
    if (isCompleteProcessNumber(search) && isValidProcessNumber(search)) {
        const searchNormalized = search.trim().toLowerCase();
        filtered = filtered.filter((process) =>
            process.numero.toLowerCase().includes(searchNormalized)
        );
    }

    // Filter by keyword search (searches in multiple fields)
    if (keywordSearch.trim()) {
        const keywordNormalized = keywordSearch.trim().toLowerCase();
        filtered = filtered.filter((process) => {
            // Search in multiple fields
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
