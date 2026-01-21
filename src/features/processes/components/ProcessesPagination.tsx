import { Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { ProcessesListParams } from '../types';
import type { SearchMode } from './ProcessesFilters';

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

interface ProcessesPaginationProps {
    itemsPerPage: number;
    onItemsPerPageChange: (value: number) => void;
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    searchMode: SearchMode;
    shouldUseApi: boolean;
    hasLocalFilters: boolean;
    isSearchComplete: boolean;
    hasKeywordSearch: boolean;
    onRefetch: (params: ProcessesListParams) => void;
    simpleFilters: {
        tribunal: string;
        grau: ProcessesListParams['grau'] | '';
    };
    advancedFilters: {
        query: string;
        tribunal: string;
        grau: ProcessesListParams['grau'] | '';
    };
}

export const ProcessesPagination = ({
    itemsPerPage,
    onItemsPerPageChange,
    loading,
    hasMore,
    onLoadMore,
    searchMode,
    shouldUseApi,
    hasLocalFilters,
    isSearchComplete,
    hasKeywordSearch,
    onRefetch,
    simpleFilters,
    advancedFilters,
}: ProcessesPaginationProps) => {
    if (!hasMore || (searchMode !== 'advanced' && !shouldUseApi && !(!hasLocalFilters && !isSearchComplete && !hasKeywordSearch))) {
        return null;
    }

    const handleItemsPerPageChange = (newLimit: number) => {
        onItemsPerPageChange(newLimit);
        const params: ProcessesListParams = { limit: newLimit };

        if (searchMode === 'simple') {
            if (simpleFilters.tribunal && simpleFilters.tribunal.trim() !== '') {
                params.tribunal = simpleFilters.tribunal;
            }
            if (simpleFilters.grau === 'PRIMEIRO' || simpleFilters.grau === 'SEGUNDO' || simpleFilters.grau === 'SUPERIOR') {
                params.grau = simpleFilters.grau;
            }
        } else {
            if (advancedFilters.query && advancedFilters.query.trim() !== '') {
                params.q = advancedFilters.query.trim();
            }
            if (advancedFilters.tribunal && advancedFilters.tribunal.trim() !== '') {
                params.tribunal = advancedFilters.tribunal;
            }
            if (advancedFilters.grau === 'PRIMEIRO' || advancedFilters.grau === 'SEGUNDO' || advancedFilters.grau === 'SUPERIOR') {
                params.grau = advancedFilters.grau;
            }
        }

        onRefetch(params);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={4} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Itens por página</InputLabel>
                <Select
                    value={itemsPerPage.toString()}
                    label="Itens por página"
                    onChange={(e: SelectChangeEvent<string>) => {
                        handleItemsPerPageChange(Number(e.target.value));
                    }}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option.toString()}>
                            {option} itens
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={onLoadMore} disabled={loading}>
                {loading ? 'Carregando...' : 'Carregar mais'}
            </Button>
        </Box>
    );
};
