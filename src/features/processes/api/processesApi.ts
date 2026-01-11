import { apiClient, handleApiError } from '@/shared/api/client';
import type {
    Process,
    ProcessesListParams,
    ProcessesListResponse,
    ApiProcessesListResponse,
    ApiProcessDetailResponse,
} from '../types';
import { mapProcessesListResponse, mapApiDetailToProcess } from './mappers';

/**
 * API Client for legal processes
 * All calls must follow the contract defined in Swagger
 */

export const processesApi = {
    /**
     * List processes with filters and cursor-based pagination
     */
    async list(params: ProcessesListParams = {}): Promise<ProcessesListResponse> {
        try {
            // Convert grau from PRIMEIRO/SEGUNDO/SUPERIOR to G1/G2/SUP for API
            const grauApi =
                params.grau === 'PRIMEIRO'
                    ? 'G1'
                    : params.grau === 'SEGUNDO'
                        ? 'G2'
                        : params.grau === 'SUPERIOR'
                            ? 'SUP'
                            : undefined;

            // Build params object according to backend contract
            // Query params: q, tribunal, grau, limit, cursor
            const apiParams: Record<string, string | number> = {};
            if (params.q) apiParams.q = params.q;
            if (params.tribunal) apiParams.tribunal = params.tribunal;
            if (grauApi) apiParams.grau = grauApi;
            if (params.cursor) apiParams.cursor = params.cursor;
            apiParams.limit = params.limit || 20;

            const response = await apiClient.get<ApiProcessesListResponse>('/lawsuits', {
                params: apiParams,
            });
            return mapProcessesListResponse(response.data);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get a specific process by case number
     */
    async getByCaseNumber(caseNumber: string): Promise<Process> {
        try {
            const response = await apiClient.get<ApiProcessDetailResponse>(`/lawsuits/${caseNumber}`);
            return mapApiDetailToProcess(response.data);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get available court options (for filters)
     * TODO: Update endpoint when available in backend
     */
    async getTribunais(): Promise<string[]> {
        try {
            const response = await apiClient.get<string[]>('/lawsuits/tribunais');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
