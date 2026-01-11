/**
 * Date formatting utilities for processes
 */

/**
 * Formats a date string to Brazilian format (DD/MM/YYYY HH:mm)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Formats a date string to Brazilian format without time (DD/MM/YYYY)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDateOnly = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};
