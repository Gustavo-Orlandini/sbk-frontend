import { useState, useEffect } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { useThemeMode } from '@/shared/contexts/ThemeContext';
import { useProcesses } from '../hooks/useProcesses';
import { useProcessesFilters } from '../hooks/useProcessesFilters';
import { useAvailableTribunals } from '../hooks/useAvailableTribunals';
import { ProcessListItem } from './ProcessListItem';
import { ProcessesPagination } from './ProcessesPagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { ProcessesFilters, type SearchMode } from './ProcessesFilters';
import { isCompleteProcessNumber, isValidProcessNumber } from '../utils/processNumberUtils';

export const ProcessesList = () => {
    const [searchMode, setSearchMode] = useState<SearchMode>('simple');
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const theme = useTheme();
    const { mode } = useThemeMode();
    const { processes, loading, error, hasMore, loadMore, refetch, currentLimit } = useProcesses({ limit: itemsPerPage });
    const availableTribunals = useAvailableTribunals(processes);
    const activeBorderColor = mode === 'dark' ? '#FFD700' : theme.palette.primary.main;

    const filters = useProcessesFilters({
        searchMode,
        itemsPerPage,
        processes,
        refetch,
    });

    useEffect(() => {
        if (currentLimit !== undefined && currentLimit !== itemsPerPage) {
            setItemsPerPage(currentLimit);
        }
    }, [currentLimit]);

    const handleSearchChange = (value: string) => {
        filters.setSearch(value);
    };

    const handleSearchModeChange = (newMode: SearchMode) => {
        setSearchMode(newMode);
        if (newMode === 'simple') {
            filters.setAdvancedQuery('');
            filters.setAdvancedTribunal('');
            filters.setAdvancedGrau('');
        } else {
            filters.setSearch('');
            filters.setKeywordSearch('');
            filters.setTribunal('');
            filters.setGrau('');
        }
        filters.clearSearchTimeout();
        refetch({ limit: itemsPerPage });
    };
    if (loading && processes.length === 0) {
        return <LoadingSpinner message="Carregando processos..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error.message}
                onRetry={() => refetch({ limit: itemsPerPage })}
                onClearFilters={filters.handleClearAndRetry}
            />
        );
    }

    const isSearchComplete = isCompleteProcessNumber(filters.search) && isValidProcessNumber(filters.search);

    return (
        <Box>
            <ProcessesFilters
                searchMode={searchMode}
                onSearchModeChange={handleSearchModeChange}
                keywordSearch={filters.keywordSearch}
                onKeywordSearchChange={filters.setKeywordSearch}
                search={filters.search}
                onSearchChange={handleSearchChange}
                searchError={filters.searchError}
                tribunal={filters.tribunal}
                onTribunalChange={filters.setTribunal}
                grau={filters.grau}
                onGrauChange={filters.setGrau}
                advancedQuery={filters.advancedQuery}
                onAdvancedQueryChange={filters.setAdvancedQuery}
                advancedTribunal={filters.advancedTribunal}
                onAdvancedTribunalChange={filters.setAdvancedTribunal}
                advancedGrau={filters.advancedGrau}
                onAdvancedGrauChange={filters.setAdvancedGrau}
                onClear={filters.handleClear}
                onAdvancedSearch={filters.handleAdvancedSearch}
                availableTribunals={availableTribunals}
                loading={loading}
                activeBorderColor={activeBorderColor}
            />

            {filters.filteredProcesses.length === 0 && !loading ? (
                <EmptyState
                    message={
                        isSearchComplete
                            ? 'Nenhum processo encontrado com este número'
                            : filters.keywordSearch.trim()
                                ? 'Nenhum processo encontrado com estas palavras-chave'
                                : 'Nenhum processo encontrado'
                    }
                    description="Tente ajustar os filtros de busca"
                />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {filters.filteredProcesses.map((process) => (
                            <Grid item xs={12} sm={6} key={process.id}>
                                <ProcessListItem process={process} />
                            </Grid>
                        ))}
                    </Grid>

                    <ProcessesPagination
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        loading={loading}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                        searchMode={searchMode}
                        shouldUseApi={filters.shouldUseApi}
                        hasLocalFilters={filters.hasLocalFilters}
                        isSearchComplete={isSearchComplete}
                        hasKeywordSearch={filters.keywordSearch.trim().length > 0}
                        onRefetch={refetch}
                        simpleFilters={{
                            tribunal: filters.tribunal,
                            grau: filters.grau,
                        }}
                        advancedFilters={{
                            query: filters.advancedQuery,
                            tribunal: filters.advancedTribunal,
                            grau: filters.advancedGrau,
                        }}
                    />
                </>
            )}
        </Box>
    );
};
