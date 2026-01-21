import { useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Search } from '@mui/icons-material';
import type { ProcessesListParams } from '../types';
import {
    applyProcessNumberMask,
    isCompleteProcessNumber,
    PROCESS_NUMBER_LENGTH,
} from '../utils/processNumberUtils';

export type SearchMode = 'simple' | 'advanced';

const GRAU_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'PRIMEIRO', label: 'Primeiro Grau' },
    { value: 'SEGUNDO', label: 'Segundo Grau' },
    { value: 'SUPERIOR', label: 'Superior' },
];

interface ProcessesFiltersProps {
    searchMode: SearchMode;
    onSearchModeChange: (mode: SearchMode) => void;
    keywordSearch: string;
    onKeywordSearchChange: (value: string) => void;
    search: string;
    onSearchChange: (value: string) => void;
    searchError: boolean;
    tribunal: string;
    onTribunalChange: (value: string) => void;
    grau: ProcessesListParams['grau'] | '';
    onGrauChange: (value: ProcessesListParams['grau'] | '') => void;
    advancedQuery: string;
    onAdvancedQueryChange: (value: string) => void;
    advancedTribunal: string;
    onAdvancedTribunalChange: (value: string) => void;
    advancedGrau: ProcessesListParams['grau'] | '';
    onAdvancedGrauChange: (value: ProcessesListParams['grau'] | '') => void;
    onClear: () => void;
    onAdvancedSearch: () => void;
    availableTribunals: string[];
    loading: boolean;
    activeBorderColor: string;
}

export const ProcessesFilters = ({
    searchMode,
    onSearchModeChange,
    keywordSearch,
    onKeywordSearchChange,
    search,
    onSearchChange,
    searchError,
    tribunal,
    onTribunalChange,
    grau,
    onGrauChange,
    advancedQuery,
    onAdvancedQueryChange,
    advancedTribunal,
    onAdvancedTribunalChange,
    advancedGrau,
    onAdvancedGrauChange,
    onClear,
    onAdvancedSearch,
    availableTribunals,
    loading,
    activeBorderColor,
}: ProcessesFiltersProps) => {
    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const maskedValue = applyProcessNumberMask(inputValue);
            onSearchChange(maskedValue);
        },
        [onSearchChange]
    );

    const handleAdvancedQueryKeyPress = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                onAdvancedSearch();
            }
        },
        [onAdvancedSearch]
    );

    const isKeywordSearchActive = !!keywordSearch.trim();
    const isProcessNumberSearchActive = !!search.trim();
    const isTribunalFilterActive = !!tribunal;
    const isGrauFilterActive = !!grau;
    const isAdvancedQueryActive = !!advancedQuery.trim();
    const isAdvancedTribunalActive = !!advancedTribunal;
    const isAdvancedGrauActive = !!advancedGrau;

    return (
        <Stack spacing={3} mb={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Modo de Busca</FormLabel>
                    <RadioGroup
                        row
                        value={searchMode}
                        onChange={(e) => {
                            const newMode = e.target.value as SearchMode;
                            onSearchModeChange(newMode);
                        }}
                    >
                        <FormControlLabel value="simple" control={<Radio />} label="Busca Simples" />
                        <FormControlLabel value="advanced" control={<Radio />} label="Busca Avançada" />
                    </RadioGroup>
                </FormControl>
            </Paper>

            {searchMode === 'simple' ? (
                <>
                    <Box>
                        <TextField
                            fullWidth
                            label="Buscar por palavras-chave"
                            placeholder="Busque por número, tribunal, classe, assunto, movimento..."
                            value={keywordSearch}
                            onChange={(e) => onKeywordSearchChange(e.target.value)}
                            helperText="Busca em todos os campos do processo (filtro local)"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isKeywordSearchActive ? activeBorderColor : undefined,
                                        borderWidth: isKeywordSearchActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isKeywordSearchActive ? activeBorderColor : undefined,
                                        borderWidth: isKeywordSearchActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isKeywordSearchActive ? activeBorderColor : undefined,
                                        borderWidth: isKeywordSearchActive ? 2 : 1,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Box>

                    <Box>
                        <TextField
                            fullWidth
                            label="Buscar por número do processo"
                            placeholder="0000000-00.0000.0.00.0000"
                            value={search}
                            onChange={handleSearchChange}
                            error={searchError}
                            helperText={
                                searchError
                                    ? 'Número inválido'
                                    : search.trim()
                                        ? isCompleteProcessNumber(search)
                                            ? 'Número completo - filtrando resultados...'
                                            : 'Digite o número completo do processo'
                                        : 'Formato: 0000000-00.0000.0.00.0000'
                            }
                            inputProps={{
                                maxLength: PROCESS_NUMBER_LENGTH,
                                inputMode: 'numeric',
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isProcessNumberSearchActive && !searchError ? activeBorderColor : undefined,
                                        borderWidth: isProcessNumberSearchActive && !searchError ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isProcessNumberSearchActive && !searchError ? activeBorderColor : undefined,
                                        borderWidth: isProcessNumberSearchActive && !searchError ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isProcessNumberSearchActive && !searchError ? activeBorderColor : undefined,
                                        borderWidth: isProcessNumberSearchActive && !searchError ? 2 : 1,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Box>

                    <Box display="flex" gap={2} flexWrap="wrap">
                        <FormControl
                            sx={{
                                flex: 1,
                                minWidth: '200px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isTribunalFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isTribunalFilterActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isTribunalFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isTribunalFilterActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isTribunalFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isTribunalFilterActive ? 2 : 1,
                                    },
                                },
                            }}
                        >
                            <InputLabel>Tribunal</InputLabel>
                            <Select
                                value={tribunal}
                                label="Tribunal"
                                onChange={(e: SelectChangeEvent<string>) => {
                                    onTribunalChange(e.target.value);
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 300,
                                            width: 'auto',
                                            minWidth: '200px',
                                            overflowX: 'hidden',
                                        },
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    disablePortal: false,
                                    disableScrollLock: true,
                                    autoFocus: false,
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {availableTribunals.map((tribunalOption) => (
                                    <MenuItem key={tribunalOption} value={tribunalOption}>
                                        {tribunalOption}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{
                                flex: 1,
                                minWidth: '200px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isGrauFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isGrauFilterActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isGrauFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isGrauFilterActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isGrauFilterActive ? activeBorderColor : undefined,
                                        borderWidth: isGrauFilterActive ? 2 : 1,
                                    },
                                },
                            }}
                        >
                            <InputLabel>Grau</InputLabel>
                            <Select
                                value={grau || ''}
                                label="Grau"
                                onChange={(e: SelectChangeEvent<string>) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === '') {
                                        onGrauChange('');
                                    } else if (selectedValue === 'PRIMEIRO' || selectedValue === 'SEGUNDO' || selectedValue === 'SUPERIOR') {
                                        onGrauChange(selectedValue as 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR');
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 300,
                                            width: 'auto',
                                            minWidth: '200px',
                                            overflowX: 'hidden',
                                        },
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    disablePortal: false,
                                    disableScrollLock: true,
                                    autoFocus: false,
                                }}
                            >
                                {GRAU_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="outlined" onClick={onClear}>
                            Limpar filtros
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box>
                        <TextField
                            fullWidth
                            label="Busca textual (q)"
                            placeholder="Busque por número, nome das partes, classe ou assunto..."
                            value={advancedQuery}
                            onChange={(e) => onAdvancedQueryChange(e.target.value)}
                            onKeyPress={handleAdvancedQueryKeyPress}
                            helperText="Busca textual via API (número do processo, nome das partes, classe ou assunto). Pressione Enter ou clique em Buscar."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isAdvancedQueryActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedQueryActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isAdvancedQueryActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedQueryActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isAdvancedQueryActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedQueryActive ? 2 : 1,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Box>

                    <Box display="flex" gap={2} flexWrap="wrap">
                        <FormControl
                            sx={{
                                flex: 1,
                                minWidth: '200px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isAdvancedTribunalActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedTribunalActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isAdvancedTribunalActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedTribunalActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isAdvancedTribunalActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedTribunalActive ? 2 : 1,
                                    },
                                },
                            }}
                        >
                            <InputLabel>Tribunal</InputLabel>
                            <Select
                                value={advancedTribunal}
                                label="Tribunal"
                                onChange={(e: SelectChangeEvent<string>) => {
                                    onAdvancedTribunalChange(e.target.value);
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 300,
                                            width: 'auto',
                                            minWidth: '200px',
                                            overflowX: 'hidden',
                                        },
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    disablePortal: false,
                                    disableScrollLock: true,
                                    autoFocus: false,
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {availableTribunals.map((tribunalOption) => (
                                    <MenuItem key={tribunalOption} value={tribunalOption}>
                                        {tribunalOption}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{
                                flex: 1,
                                minWidth: '200px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isAdvancedGrauActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedGrauActive ? 2 : 1,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isAdvancedGrauActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedGrauActive ? 2 : 1,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isAdvancedGrauActive ? activeBorderColor : undefined,
                                        borderWidth: isAdvancedGrauActive ? 2 : 1,
                                    },
                                },
                            }}
                        >
                            <InputLabel>Grau</InputLabel>
                            <Select
                                value={advancedGrau || ''}
                                label="Grau"
                                onChange={(e: SelectChangeEvent<string>) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === '') {
                                        onAdvancedGrauChange('');
                                    } else if (selectedValue === 'PRIMEIRO' || selectedValue === 'SEGUNDO' || selectedValue === 'SUPERIOR') {
                                        onAdvancedGrauChange(selectedValue as 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR');
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 300,
                                            width: 'auto',
                                            minWidth: '200px',
                                            overflowX: 'hidden',
                                        },
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    disablePortal: false,
                                    disableScrollLock: true,
                                    autoFocus: false,
                                }}
                            >
                                {GRAU_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" onClick={onClear}>
                            Limpar filtros
                        </Button>
                        <Button variant="contained" startIcon={<Search />} onClick={onAdvancedSearch} disabled={loading}>
                            Buscar
                        </Button>
                    </Box>
                </>
            )}
        </Stack>
    );
};
