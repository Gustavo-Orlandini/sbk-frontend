import { useState, useEffect, useCallback, useRef } from 'react';
import { processesApi } from '../api/processesApi';
import type { ApiError } from '@/shared/api/client';
import type { ProcessListItem, ProcessesListParams, ProcessesListResponse } from '../types';
import { useToast } from '@/shared/hooks/useToast';

interface UseProcessesReturn {
    processes: ProcessListItem[];
    loading: boolean;
    error: ApiError | null;
    hasMore: boolean;
    nextCursor?: string;
    currentLimit?: number; // Expose current limit being used
    loadMore: () => void;
    refetch: (params?: ProcessesListParams) => void;
    reset: () => void;
}

export const useProcesses = (initialParams?: ProcessesListParams): UseProcessesReturn => {
    const [processes, setProcesses] = useState<ProcessListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [currentParams, setCurrentParams] = useState<ProcessesListParams | undefined>(initialParams);
    const [initialized, setInitialized] = useState(false);
    const { showError, showSuccess } = useToast();
    const toastRef = useRef({ showError, showSuccess });

    useEffect(() => {
        toastRef.current = { showError, showSuccess };
    }, [showError, showSuccess]);

    const fetchProcesses = useCallback(async (params: ProcessesListParams, append = false, silent = false) => {
        setLoading(true);
        setError(null);

        try {
            const response: ProcessesListResponse = await processesApi.list(params);

            if (append) {
                setProcesses((prev) => [...prev, ...response.data]);
                if (!silent && response.data.length > 0) {
                    toastRef.current.showSuccess(`${response.data.length} processo(s) carregado(s) com sucesso`);
                }
            } else {
                setProcesses(response.data);
                if (!silent && response.data.length > 0) {
                    toastRef.current.showSuccess(`${response.data.length} processo(s) encontrado(s)`);
                }
            }

            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
            toastRef.current.showError(apiError.message || 'Erro ao carregar processos');
            if (!append) {
                setProcesses([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && nextCursor && currentParams) {
            fetchProcesses({ ...currentParams, cursor: nextCursor }, true, false);
        }
    }, [loading, hasMore, nextCursor, currentParams, fetchProcesses]);

    const refetch = useCallback((params?: ProcessesListParams) => {
        const newParams = params || currentParams || {};
        setCurrentParams(newParams);
        fetchProcesses(newParams, false, false);
    }, [currentParams, fetchProcesses]);

    const reset = useCallback(() => {
        setProcesses([]);
        setError(null);
        setHasMore(false);
        setNextCursor(undefined);
        setCurrentParams(initialParams);
        setInitialized(false);
    }, [initialParams]);

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            const paramsToUse = initialParams ?? {};
            setCurrentParams(paramsToUse);
            fetchProcesses(paramsToUse, false, true);
        }
    }, [initialParams, initialized, fetchProcesses]);

    return {
        processes,
        loading,
        error,
        hasMore,
        nextCursor,
        currentLimit: currentParams?.limit,
        loadMore,
        refetch,
        reset,
    };
};
