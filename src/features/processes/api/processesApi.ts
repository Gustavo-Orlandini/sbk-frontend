import { apiClient, handleApiError } from '@/shared/api/client';
import type {
    Process,
    ProcessesListParams,
    ProcessesListResponse,
    ApiProcessesListResponse,
    ApiProcessDetailResponse,
} from '../types';
import { mapProcessesListResponse, mapApiDetailToProcess } from './mappers';

export const processesApi = {
    async list(params: ProcessesListParams = {}): Promise<ProcessesListResponse> {
        try {
            const grauApi =
                params.grau === 'PRIMEIRO'
                    ? 'G1'
                    : params.grau === 'SEGUNDO'
                        ? 'G2'
                        : params.grau === 'SUPERIOR'
                            ? 'SUP'
                            : undefined;

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

    async getByCaseNumber(caseNumber: string): Promise<Process> {
        try {
            const response = await apiClient.get<ApiProcessDetailResponse>(`/lawsuits/${caseNumber}`);
            return mapApiDetailToProcess(response.data);
        } catch (error) {
            throw handleApiError(error);
        }
    },

};
