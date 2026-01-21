import { useState, useCallback, useEffect, useRef } from 'react';
import type { SearchMode } from '../components/ProcessesFilters';
import type { ProcessesListParams, ProcessListItem as ProcessListItemType } from '../types';
import { isCompleteProcessNumber, isValidProcessNumber } from '../utils/processNumberUtils';
import { filterProcesses } from '../utils/filterUtils';

const DEBOUNCE_DELAY = 800;

interface UseProcessesFiltersProps {
    searchMode: SearchMode;
    itemsPerPage: number;
    processes: ProcessListItemType[];
    refetch: (params?: ProcessesListParams) => void;
}

interface UseProcessesFiltersReturn {
    search: string;
    setSearch: (value: string) => void;
    keywordSearch: string;
    setKeywordSearch: (value: string) => void;
    searchError: boolean;
    advancedQuery: string;
    setAdvancedQuery: (value: string) => void;
    advancedTribunal: string;
    setAdvancedTribunal: (value: string) => void;
    advancedGrau: ProcessesListParams['grau'] | '';
    setAdvancedGrau: (value: ProcessesListParams['grau'] | '') => void;
    tribunal: string;
    setTribunal: (value: string) => void;
    grau: ProcessesListParams['grau'] | '';
    setGrau: (value: ProcessesListParams['grau'] | '') => void;
    filteredProcesses: ProcessListItemType[];
    shouldUseApi: boolean;
    hasLocalFilters: boolean;
    handleClear: () => void;
    handleClearAndRetry: () => void;
    handleAdvancedSearch: () => void;
    clearSearchTimeout: () => void;
}

export const useProcessesFilters = ({
    searchMode,
    itemsPerPage,
    processes,
    refetch,
}: UseProcessesFiltersProps): UseProcessesFiltersReturn => {
    const [search, setSearch] = useState('');
    const [keywordSearch, setKeywordSearch] = useState('');
    const [searchError, setSearchError] = useState(false);
    const [advancedQuery, setAdvancedQuery] = useState('');
    const [advancedTribunal, setAdvancedTribunal] = useState('');
    const [advancedGrau, setAdvancedGrau] = useState<ProcessesListParams['grau'] | ''>('');
    const [tribunal, setTribunal] = useState('');
    const [grau, setGrau] = useState<ProcessesListParams['grau'] | ''>('');
    const [filteredProcesses, setFilteredProcesses] = useState<ProcessListItemType[]>([]);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);
    const refetchRef = useRef(refetch);
    const itemsPerPageRef = useRef(itemsPerPage);
    const previousSearchRef = useRef(search);
    const previousTribunalRef = useRef(tribunal);
    const previousGrauRef = useRef(grau);
    const previousKeywordSearchRef = useRef(keywordSearch);
    const hasApiFilters = searchMode === 'simple' && (!!tribunal || !!grau);
    const isSearchComplete = isCompleteProcessNumber(search) && isValidProcessNumber(search);
    const hasKeywordSearch = keywordSearch.trim().length > 0;
    const shouldUseApi = hasApiFilters || (searchMode === 'simple' && (isSearchComplete || hasKeywordSearch));
    const hasLocalFilters = searchMode === 'simple' && !shouldUseApi && !!(search.trim() || keywordSearch.trim());
    const searchChanged = search !== previousSearchRef.current;
    const tribunalChanged = tribunal !== previousTribunalRef.current;
    const grauChanged = grau !== previousGrauRef.current;
    const keywordSearchChanged = keywordSearch !== previousKeywordSearchRef.current;
    const isSearchCompleteNow = isCompleteProcessNumber(search) && isValidProcessNumber(search);
    const wasSearchComplete = isCompleteProcessNumber(previousSearchRef.current) && isValidProcessNumber(previousSearchRef.current);
    const hasKeywordNow = keywordSearch.trim().length > 0;

    useEffect(() => {
        refetchRef.current = refetch;
        itemsPerPageRef.current = itemsPerPage;
    }, [refetch, itemsPerPage]);

    useEffect(() => {
        if (search.trim()) {
            const isComplete = isCompleteProcessNumber(search);
            setSearchError(isComplete && !isValidProcessNumber(search));
        } else {
            setSearchError(false);
        }
    }, [search]);

    useEffect(() => {
        if (searchMode === 'simple' && hasLocalFilters && !shouldUseApi) {
            const filtered = filterProcesses({
                processList: processes,
                search,
                keywordSearch,
            });
            setFilteredProcesses(filtered);
        } else {
            setFilteredProcesses(processes);
        }
    }, [searchMode, search, keywordSearch, processes, shouldUseApi, hasLocalFilters]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }

        if (searchMode !== 'simple' || !shouldUseApi) {
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }

        if (searchError) {
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }


        if (searchChanged && !isSearchCompleteNow && !tribunalChanged && !grauChanged && !hasApiFilters && !hasKeywordNow && !keywordSearchChanged) {
            if (!wasSearchComplete) {
                previousSearchRef.current = search;
                return;
            }
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const params: ProcessesListParams = {
                limit: itemsPerPageRef.current,
            };

            if (tribunal && tribunal.trim() !== '') {
                params.tribunal = tribunal;
            }
            if (grau === 'PRIMEIRO' || grau === 'SEGUNDO' || grau === 'SUPERIOR') {
                params.grau = grau;
            }

            let queryText = '';
            if (isCompleteProcessNumber(search) && isValidProcessNumber(search)) {
                queryText = search.trim();
            } else if (keywordSearch.trim()) {
                queryText = keywordSearch.trim();
            }

            if (queryText) {
                params.q = queryText;
            }

            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;

            refetchRef.current(params);
        }, DEBOUNCE_DELAY);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchMode, tribunal, grau, search, keywordSearch, searchError, shouldUseApi, hasApiFilters]);

    const clearSearchTimeout = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    }, []);

    const handleAdvancedSearch = useCallback(() => {
        const params: ProcessesListParams = {
            limit: itemsPerPage,
        };

        if (advancedQuery && advancedQuery.trim() !== '') {
            params.q = advancedQuery.trim();
        }
        if (advancedTribunal && advancedTribunal.trim() !== '') {
            params.tribunal = advancedTribunal;
        }
        if (advancedGrau === 'PRIMEIRO' || advancedGrau === 'SEGUNDO' || advancedGrau === 'SUPERIOR') {
            params.grau = advancedGrau;
        }

        refetch(params);
    }, [advancedQuery, advancedTribunal, advancedGrau, itemsPerPage, refetch]);

    const handleClear = useCallback(() => {
        if (searchMode === 'simple') {
            setSearch('');
            setKeywordSearch('');
            setTribunal('');
            setGrau('');
        } else {
            setAdvancedQuery('');
            setAdvancedTribunal('');
            setAdvancedGrau('');
        }
        setSearchError(false);
        clearSearchTimeout();
        refetch({ limit: itemsPerPage });
    }, [refetch, searchMode, itemsPerPage, clearSearchTimeout]);

    const handleClearAndRetry = useCallback(() => {
        if (searchMode === 'simple') {
            setSearch('');
            setKeywordSearch('');
            setTribunal('');
            setGrau('');
        } else {
            setAdvancedQuery('');
            setAdvancedTribunal('');
            setAdvancedGrau('');
        }
        setSearchError(false);
        clearSearchTimeout();
        refetch({ limit: itemsPerPage });
    }, [refetch, searchMode, itemsPerPage, clearSearchTimeout]);

    return {
        search,
        setSearch,
        keywordSearch,
        setKeywordSearch,
        searchError,
        advancedQuery,
        setAdvancedQuery,
        advancedTribunal,
        setAdvancedTribunal,
        advancedGrau,
        setAdvancedGrau,
        tribunal,
        setTribunal,
        grau,
        setGrau,
        filteredProcesses,
        shouldUseApi,
        hasLocalFilters,
        handleClear,
        handleClearAndRetry,
        handleAdvancedSearch,
        clearSearchTimeout,
    };
};
