/**
 * Custom hook for toast notifications
 * Provides a simple interface for showing success, error, warning, and info messages
 */

import { useSnackbar, VariantType } from 'notistack';

export const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showToast = (message: string, variant: VariantType = 'info') => {
        enqueueSnackbar(message, {
            variant,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
            autoHideDuration: variant === 'error' ? 6000 : 4000,
        });
    };

    return {
        showSuccess: (message: string) => showToast(message, 'success'),
        showError: (message: string) => showToast(message, 'error'),
        showWarning: (message: string) => showToast(message, 'warning'),
        showInfo: (message: string) => showToast(message, 'info'),
    };
};
