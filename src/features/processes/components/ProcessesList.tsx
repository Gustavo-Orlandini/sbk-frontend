import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Grid, Button, useTheme, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useThemeMode } from '@/shared/contexts/ThemeContext';
import { useProcesses } from '../hooks/useProcesses';
import { ProcessListItem } from './ProcessListItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { ProcessesFilters, type SearchMode } from './ProcessesFilters';
import type { ProcessesListParams, ProcessListItem as ProcessListItemType } from '../types';
import { isCompleteProcessNumber, isValidProcessNumber } from '../utils/processNumberUtils';
import { filterProcesses } from '../utils/filterUtils';
import { processesApi } from '../api/processesApi';

const DEBOUNCE_DELAY = 800; // 800ms delay for search to reduce API calls

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export const ProcessesList = () => {
    const [searchMode, setSearchMode] = useState<SearchMode>('simple');
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    // Simple search state (local filtering)
    const [search, setSearch] = useState('');
    const [keywordSearch, setKeywordSearch] = useState('');
    const [searchError, setSearchError] = useState(false);

    // Advanced search state (API query params)
    const [advancedQuery, setAdvancedQuery] = useState('');
    const [advancedTribunal, setAdvancedTribunal] = useState('');
    const [advancedGrau, setAdvancedGrau] = useState<ProcessesListParams['grau'] | ''>('');

    // Shared state for simple mode filters (kept for backward compatibility)
    const [tribunal, setTribunal] = useState('');
    const [grau, setGrau] = useState<ProcessesListParams['grau'] | ''>('');

    const [filteredProcesses, setFilteredProcesses] = useState<ProcessListItemType[]>([]);

    const theme = useTheme();
    const { mode } = useThemeMode();
    const { processes, loading, error, hasMore, loadMore, refetch, currentLimit } = useProcesses({ limit: itemsPerPage });

    // Sync itemsPerPage with currentLimit from hook to keep select in sync
    // This ensures the select shows the correct limit being used in API requests
    useEffect(() => {
        if (currentLimit !== undefined && currentLimit !== itemsPerPage) {
            setItemsPerPage(currentLimit);
        }
    }, [currentLimit]); // Only depend on currentLimit to avoid loops
    const searchTimeoutRef = useRef<number | null>(null);
    const isFirstRender = useRef(true);
    const refetchRef = useRef(refetch);
    const itemsPerPageRef = useRef(itemsPerPage);
    const previousSearchRef = useRef(search);
    const previousTribunalRef = useRef(tribunal);
    const previousGrauRef = useRef(grau);
    const previousKeywordSearchRef = useRef(keywordSearch);

    // Keep refs updated
    useEffect(() => {
        refetchRef.current = refetch;
        itemsPerPageRef.current = itemsPerPage;
    }, [refetch, itemsPerPage]);

    // Validate search input - only show error when number is complete
    useEffect(() => {
        if (search.trim()) {
            const isComplete = isCompleteProcessNumber(search);
            // Only show error if the number is complete but invalid
            setSearchError(isComplete && !isValidProcessNumber(search));
        } else {
            setSearchError(false);
        }
    }, [search]);

    // Determine if we need to use API (when filters are active OR when search number/keyword is provided) or local filtering
    const hasApiFilters = searchMode === 'simple' && (!!tribunal || !!grau);
    const isSearchComplete = isCompleteProcessNumber(search) && isValidProcessNumber(search);
    const hasKeywordSearch = keywordSearch.trim().length > 0;
    // Use API when: 1) Has API filters (tribunal/grau), OR 2) Search number is complete, OR 3) Has keyword search
    const shouldUseApi = hasApiFilters || (searchMode === 'simple' && (isSearchComplete || hasKeywordSearch));
    // Local filtering only when no API should be used (empty searches or very early typing)
    const hasLocalFilters = searchMode === 'simple' && !shouldUseApi && (search.trim() || keywordSearch.trim());

    // Filter processes locally when only local filters are active (incomplete search/keyword without tribunal/grau)
    useEffect(() => {
        if (searchMode === 'simple' && hasLocalFilters && !shouldUseApi) {
            const filtered = filterProcesses({
                processList: processes,
                search,
                keywordSearch,
            });
            setFilteredProcesses(filtered);
        } else {
            // Advanced mode, simple mode with API filters, or complete search number: use API results directly (no local filtering)
            setFilteredProcesses(processes);
        }
    }, [searchMode, search, keywordSearch, processes, shouldUseApi, hasLocalFilters]);

    // Fetch all available tribunals by loading all processes (with maximum limit)
    const [availableTribunals, setAvailableTribunals] = useState<string[]>([]);
    const tribunalsFetchedRef = useRef(false);

    useEffect(() => {
        const fetchAllTribunals = async () => {
            if (tribunalsFetchedRef.current) return; // Only fetch once
            tribunalsFetchedRef.current = true;

            try {
                // Fetch with maximum limit (100) to get all tribunals
                const response = await processesApi.list({ limit: 100 });
                const allTribunals = new Set<string>();

                // Extract tribunals from first batch
                response.data.forEach((process) => {
                    if (process.tribunal) {
                        allTribunals.add(process.tribunal);
                    }
                });

                // If there are more items, continue fetching with cursor
                let currentCursor = response.nextCursor;
                while (currentCursor) {
                    const nextResponse = await processesApi.list({ limit: 100, cursor: currentCursor });
                    nextResponse.data.forEach((process) => {
                        if (process.tribunal) {
                            allTribunals.add(process.tribunal);
                        }
                    });
                    currentCursor = nextResponse.nextCursor;
                }

                setAvailableTribunals(Array.from(allTribunals).sort());
            } catch (error) {
                console.warn('Failed to fetch all tribunals, using loaded processes', error);
                // Fallback to extracting from loaded processes
                const tribunalsFromProcesses = Array.from(
                    new Set(processes.map((process) => process.tribunal).filter(Boolean))
                ).sort();
                setAvailableTribunals(tribunalsFromProcesses);
                tribunalsFetchedRef.current = false; // Allow retry
            }
        };

        fetchAllTribunals();
    }, []); // Only fetch once on mount

    // Border color based on theme
    const activeBorderColor = mode === 'dark' ? '#FFD700' : theme.palette.primary.main; // Gold for dark, blue for light

    // Debounced filters effect (for simple mode with API filters OR complete search number)
    useEffect(() => {
        // Skip first render to avoid duplicate initial fetch
        if (isFirstRender.current) {
            isFirstRender.current = false;
            // Update refs for future comparisons
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }

        // Only apply debounced search for simple mode with API filters (tribunal/grau), complete search number, OR keyword search
        if (searchMode !== 'simple' || !shouldUseApi) {
            // Update refs even if we don't process
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }

        // Don't make API call if search is invalid when complete
        if (searchError) {
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;
            return;
        }

        // Detect what changed
        const searchChanged = search !== previousSearchRef.current;
        const tribunalChanged = tribunal !== previousTribunalRef.current;
        const grauChanged = grau !== previousGrauRef.current;
        const keywordSearchChanged = keywordSearch !== previousKeywordSearchRef.current;

        // Check if search is complete
        const isSearchCompleteNow = isCompleteProcessNumber(search) && isValidProcessNumber(search);
        const wasSearchComplete = isCompleteProcessNumber(previousSearchRef.current) && isValidProcessNumber(previousSearchRef.current);
        const hasKeywordNow = keywordSearch.trim().length > 0;

        // Only trigger API call if:
        // 1. Tribunal or Grau changed (always trigger when they are set)
        // 2. Search changed AND became complete (incomplete -> complete)
        // 3. Keyword search changed (always trigger when keyword is provided, with debounce)
        // 4. Search was complete and now is empty/incomplete (to clear the filter)
        // Do NOT trigger if search is incomplete and only search changed (and no API filters/keyword)
        if (searchChanged && !isSearchCompleteNow && !tribunalChanged && !grauChanged && !hasApiFilters && !hasKeywordNow && !keywordSearchChanged) {
            // Search changed but is incomplete and no other filters changed - don't make API call
            // But if search was complete before, we need to clear the filter
            if (!wasSearchComplete) {
                // Never was complete, and still isn't - don't make API call
                previousSearchRef.current = search;
                return;
            }
            // Search was complete before but now isn't - we need to clear the q parameter by making a call
            // Continue to the setTimeout below
        }

        // If search just became complete (incomplete -> complete), we MUST make the API call
        // If keyword search changed, we MUST make the API call
        // This ensures we find processes that aren't in the current loaded batch

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for filters (simple mode with API filters, complete search, or keyword search)
        searchTimeoutRef.current = setTimeout(() => {
            const params: ProcessesListParams = {
                limit: itemsPerPageRef.current,
            };

            // Simple mode with API filters: combine tribunal, grau, search number if complete, and keyword search
            if (tribunal && tribunal.trim() !== '') {
                params.tribunal = tribunal;
            }
            if (grau === 'PRIMEIRO' || grau === 'SEGUNDO' || grau === 'SUPERIOR') {
                params.grau = grau;
            }

            // Build query parameter (q) from search number or keyword search
            // Priority: complete search number > keyword search
            let queryText = '';
            if (isCompleteProcessNumber(search) && isValidProcessNumber(search)) {
                // If search number is complete, use it
                queryText = search.trim();
            } else if (keywordSearch.trim()) {
                // Otherwise, use keyword search if available
                queryText = keywordSearch.trim();
            }

            // Only include q parameter if we have a query
            if (queryText) {
                params.q = queryText;
            }

            // Update refs before making the call
            previousSearchRef.current = search;
            previousTribunalRef.current = tribunal;
            previousGrauRef.current = grau;
            previousKeywordSearchRef.current = keywordSearch;

            // Call refetch with current filters
            refetchRef.current(params);
        }, DEBOUNCE_DELAY);

        // Cleanup on unmount
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchMode, tribunal, grau, search, keywordSearch, searchError, shouldUseApi, hasApiFilters]);

    // Handler for advanced search button
    const handleAdvancedSearch = useCallback(() => {
        const params: ProcessesListParams = {
            limit: itemsPerPage,
        };

        // Advanced mode: use API query params (q, tribunal, grau)
        if (advancedQuery && advancedQuery.trim() !== '') {
            params.q = advancedQuery.trim();
        }
        if (advancedTribunal && advancedTribunal.trim() !== '') {
            params.tribunal = advancedTribunal;
        }
        if (advancedGrau === 'PRIMEIRO' || advancedGrau === 'SEGUNDO' || advancedGrau === 'SUPERIOR') {
            params.grau = advancedGrau;
        }

        // Call refetch immediately (no debounce)
        refetch(params);
    }, [advancedQuery, advancedTribunal, advancedGrau, itemsPerPage, refetch]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

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
        // Clear timeout and refetch immediately
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        refetch({ limit: itemsPerPage });
    }, [refetch, searchMode, itemsPerPage]);

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
        // Clear timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // Retry with empty params
        refetch({ limit: itemsPerPage });
    }, [refetch, searchMode, itemsPerPage]);

    const handleSearchModeChange = useCallback(
        (newMode: SearchMode) => {
            setSearchMode(newMode);
            // Clear filters when switching modes
            if (newMode === 'simple') {
                setAdvancedQuery('');
                setAdvancedTribunal('');
                setAdvancedGrau('');
            } else {
                setSearch('');
                setKeywordSearch('');
                setTribunal('');
                setGrau('');
            }
            // Reset and refetch
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            refetch({ limit: itemsPerPage });
        },
        [refetch, itemsPerPage]
    );

    // Early returns must come AFTER all hooks and callbacks
    if (loading && processes.length === 0) {
        return <LoadingSpinner message="Carregando processos..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error.message}
                onRetry={() => refetch({ limit: itemsPerPage })}
                onClearFilters={handleClearAndRetry}
            />
        );
    }

    return (
        <Box>
            <ProcessesFilters
                searchMode={searchMode}
                onSearchModeChange={handleSearchModeChange}
                keywordSearch={keywordSearch}
                onKeywordSearchChange={setKeywordSearch}
                search={search}
                onSearchChange={handleSearchChange}
                searchError={searchError}
                tribunal={tribunal}
                onTribunalChange={setTribunal}
                grau={grau}
                onGrauChange={setGrau}
                advancedQuery={advancedQuery}
                onAdvancedQueryChange={setAdvancedQuery}
                advancedTribunal={advancedTribunal}
                onAdvancedTribunalChange={setAdvancedTribunal}
                advancedGrau={advancedGrau}
                onAdvancedGrauChange={setAdvancedGrau}
                onClear={handleClear}
                onAdvancedSearch={handleAdvancedSearch}
                availableTribunals={availableTribunals}
                loading={loading}
                activeBorderColor={activeBorderColor}
            />

            {filteredProcesses.length === 0 && !loading ? (
                <EmptyState
                    message={
                        isCompleteProcessNumber(search) && isValidProcessNumber(search)
                            ? 'Nenhum processo encontrado com este número'
                            : keywordSearch.trim()
                                ? 'Nenhum processo encontrado com estas palavras-chave'
                                : 'Nenhum processo encontrado'
                    }
                    description="Tente ajustar os filtros de busca"
                />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {filteredProcesses.map((process) => (
                            <Grid item xs={12} sm={6} key={process.id}>
                                <ProcessListItem process={process} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Show "Load more" button when there are more items from API
                        Hide it only when filtering locally (simple mode with incomplete search/keyword but no API filters) */}
                    {hasMore && (searchMode === 'advanced' || shouldUseApi || (!hasLocalFilters && !isCompleteProcessNumber(search) && !keywordSearch.trim())) && (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={4} flexWrap="wrap">
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Itens por página</InputLabel>
                                <Select
                                    value={itemsPerPage.toString()}
                                    label="Itens por página"
                                    onChange={(e: SelectChangeEvent<string>) => {
                                        const newLimit = Number(e.target.value);
                                        setItemsPerPage(newLimit);
                                        // Reset and refetch with new limit
                                        const params: ProcessesListParams = { limit: newLimit };

                                        if (searchMode === 'simple') {
                                            if (tribunal && tribunal.trim() !== '') {
                                                params.tribunal = tribunal;
                                            }
                                            if (grau === 'PRIMEIRO' || grau === 'SEGUNDO' || grau === 'SUPERIOR') {
                                                params.grau = grau;
                                            }
                                        } else {
                                            if (advancedQuery && advancedQuery.trim() !== '') {
                                                params.q = advancedQuery.trim();
                                            }
                                            if (advancedTribunal && advancedTribunal.trim() !== '') {
                                                params.tribunal = advancedTribunal;
                                            }
                                            if (advancedGrau === 'PRIMEIRO' || advancedGrau === 'SEGUNDO' || advancedGrau === 'SUPERIOR') {
                                                params.grau = advancedGrau;
                                            }
                                        }

                                        refetch(params);
                                    }}
                                >
                                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                        <MenuItem key={option} value={option.toString()}>
                                            {option} itens
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    // Ensure loadMore uses current filters
                                    // The loadMore function from useProcesses already uses currentParams
                                    // which includes all active filters, so we just call it
                                    loadMore();
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Carregando...' : 'Carregar mais'}
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};
