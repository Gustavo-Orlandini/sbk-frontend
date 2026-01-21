import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error(
        'VITE_API_BASE_URL is not defined. Please set it in your .env file. ' +
        'See env.example.txt for reference.'
    );
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiError {
    message: string;
    status?: number;
    data?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string | string[] }>;

        let errorMessage: string;
        if (Array.isArray(axiosError.response?.data?.message)) {
            errorMessage = axiosError.response.data.message.join('. ');
        } else if (typeof axiosError.response?.data?.message === 'string') {
            errorMessage = axiosError.response.data.message;
        } else {
            errorMessage = axiosError.message || 'Erro ao processar requisição';
        }

        return {
            message: errorMessage,
            status: axiosError.response?.status,
            data: axiosError.response?.data,
        };
    }

    return {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
};
