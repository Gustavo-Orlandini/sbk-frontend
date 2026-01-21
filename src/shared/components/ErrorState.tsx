import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    onClearFilters?: () => void;
}

export const ErrorState = ({ message, onRetry, onClearFilters }: ErrorStateProps) => {
    const getFriendlyMessage = (msg: string): string => {
        if (msg.includes('property search should not exist')) {
            return 'O parâmetro de busca não é suportado pela API. Por favor, use os filtros disponíveis.';
        }
        if (msg.includes('BadRequestException')) {
            return 'Requisição inválida. Verifique os filtros selecionados.';
        }
        if (msg.includes('404') || msg.includes('Not Found')) {
            return 'Recurso não encontrado.';
        }
        if (msg.includes('500') || msg.includes('Internal Server Error')) {
            return 'Erro interno do servidor. Tente novamente mais tarde.';
        }
        return msg;
    };

    const friendlyMessage = getFriendlyMessage(message);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="300px"
            gap={3}
            p={4}
        >
            <ErrorOutline
                color="error"
                sx={{
                    fontSize: 64,
                    opacity: 0.8,
                }}
            />
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    maxWidth: 600,
                    width: '100%',
                }}
            >
                <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Erro ao carregar dados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {friendlyMessage}
                    </Typography>
                </Alert>
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                    {onClearFilters && (
                        <Button
                            variant="outlined"
                            onClick={onClearFilters}
                            startIcon={<Refresh />}
                        >
                            Limpar filtros
                        </Button>
                    )}
                    {onRetry && (
                        <Button
                            variant="contained"
                            onClick={onRetry}
                            startIcon={<Refresh />}
                        >
                            Tentar novamente
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};
