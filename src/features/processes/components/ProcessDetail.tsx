import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Chip,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Pagination,
    TextField,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useProcess } from '../hooks/useProcess';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';
import type { SimplifiedParte } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ProcessDetailProps {
    id: string; // caseNumber from route
}

export const ProcessDetail = ({ id }: ProcessDetailProps) => {
    // id is actually the caseNumber (numero do processo)
    const { process, loading, error, refetch } = useProcess(id);
    const [pageAtivo, setPageAtivo] = useState(1);
    const [pagePassivo, setPagePassivo] = useState(1);
    const [itemsPerPageAtivo, setItemsPerPageAtivo] = useState(10);
    const [itemsPerPagePassivo, setItemsPerPagePassivo] = useState(10);

    // Sort and paginate partes
    const sortAndPaginatePartes = (
        partes: SimplifiedParte[],
        page: number,
        itemsPerPage: number
    ) => {
        // Sort alphabetically by nome
        const sorted = [...partes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

        // Calculate pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = sorted.slice(startIndex, endIndex);
        const totalPages = Math.ceil(sorted.length / itemsPerPage);

        return {
            data: paginated,
            totalPages,
            totalItems: sorted.length,
        };
    };

    // Prepare data for useMemo - use empty arrays if process is not loaded yet
    const partesAtivasRaw = process?.partes?.filter((p) => p.tipo === 'ATIVO') || [];
    const partesPassivasRaw = process?.partes?.filter((p) => p.tipo === 'PASSIVO') || [];

    // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
    const partesAtivasPaginated = useMemo(
        () => sortAndPaginatePartes(partesAtivasRaw, pageAtivo, itemsPerPageAtivo),
        [partesAtivasRaw, pageAtivo, itemsPerPageAtivo]
    );

    const partesPassivasPaginated = useMemo(
        () => sortAndPaginatePartes(partesPassivasRaw, pagePassivo, itemsPerPagePassivo),
        [partesPassivasRaw, pagePassivo, itemsPerPagePassivo]
    );

    // Now we can do early returns
    if (loading) {
        return <LoadingSpinner message="Carregando detalhes do processo..." />;
    }

    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!process) {
        return null;
    }

    const ultimoMovimento = process.movimentos && process.movimentos.length > 0
        ? process.movimentos[process.movimentos.length - 1]
        : process.ultimoMovimento;

    return (
        <Box>
            {/* Cabeçalho do Processo */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                            Número do Processo
                        </Typography>
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            {process.numero}
                        </Typography>
                        <Chip
                            label={`Nível de Sigilo: ${process.nivelSigilo}`}
                            size="small"
                            color={process.nivelSigilo > 0 ? 'warning' : 'default'}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                    <Chip
                        label={process.grau}
                        color={
                            process.grau === 'PRIMEIRO'
                                ? 'primary'
                                : process.grau === 'SEGUNDO'
                                    ? 'secondary'
                                    : 'warning' // SUPERIOR uses warning color (orange/amber)
                        }
                    />
                </Box>

                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                            Tribunal
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {process.tribunal}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                            Órgão Julgador
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {process.tramitacaoAtual?.local || 'Não informado'}
                        </Typography>
                    </Grid>

                    {process.classes && process.classes.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                                Classes
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {process.classes.map((classe, index) => (
                                    <Chip
                                        key={index}
                                        label={classe}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Grid>
                    )}

                    {process.assuntos && process.assuntos.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                                Assuntos
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {process.assuntos.map((assunto, index) => (
                                    <Chip
                                        key={index}
                                        label={assunto}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                    />
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Último Movimento - Destaque */}
            {ultimoMovimento && (
                <Paper
                    elevation={3}
                    sx={(theme) => ({
                        p: 3,
                        mb: 3,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.primary.contrastText
                            : theme.palette.getContrastText(theme.palette.primary.light),
                    })}
                >
                    <Typography variant="overline" display="block" mb={1} sx={{ opacity: 0.8 }}>
                        ÚLTIMO MOVIMENTO
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        {ultimoMovimento.descricao}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={0.5} sx={{ opacity: 0.9 }}>
                        <Typography variant="body2">
                            {formatDate(ultimoMovimento.data)}
                        </Typography>
                        {ultimoMovimento.orgaoJulgador && (
                            <Typography variant="body2">
                                Órgão Julgador: {ultimoMovimento.orgaoJulgador}
                            </Typography>
                        )}
                        {ultimoMovimento.codigo && (
                            <Typography variant="body2">
                                Código: {ultimoMovimento.codigo}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            )}

            {/* Partes - Polo Ativo */}
            {partesAtivasRaw.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Polo Ativo ({partesAtivasPaginated.totalItems})
                        </Typography>
                        {partesAtivasRaw.length > 10 && (
                            <TextField
                                type="number"
                                label="Itens por página"
                                value={itemsPerPageAtivo}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 1 && value <= 100) {
                                        setItemsPerPageAtivo(value);
                                        setPageAtivo(1); // Reset to first page
                                    }
                                }}
                                inputProps={{
                                    min: 1,
                                    max: 100,
                                }}
                                size="small"
                                sx={{ width: 150 }}
                            />
                        )}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {partesAtivasPaginated.data.map((parte) => (
                            <Grid item xs={12} sm={6} key={parte.id}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'action.hover',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {parte.nome}
                                        </Typography>
                                        {parte.tipoParte && (
                                            <Chip
                                                label={parte.tipoParte}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                    {parte.documento && (
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            {parte.documento}
                                        </Typography>
                                    )}
                                    {parte.representantes && parte.representantes.length > 0 && (
                                        <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMore />}
                                                sx={{ px: 0, minHeight: 'auto', '&.Mui-expanded': { minHeight: 'auto' } }}
                                            >
                                                <Typography variant="caption" color="text.secondary">
                                                    Representantes ({parte.representantes.length})
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ pt: 0, px: 0 }}>
                                                {parte.representantes.map((rep) => (
                                                    <Typography
                                                        key={rep.id}
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ fontSize: '0.875rem', mb: 0.5 }}
                                                    >
                                                        • {rep.nome} ({rep.tipo})
                                                    </Typography>
                                                ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {partesAtivasRaw.length > 10 && partesAtivasPaginated.totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={partesAtivasPaginated.totalPages}
                                page={pageAtivo}
                                onChange={(_, newPage) => setPageAtivo(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
                </Paper>
            )}

            {/* Partes - Polo Passivo */}
            {partesPassivasRaw.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Polo Passivo ({partesPassivasPaginated.totalItems})
                        </Typography>
                        {partesPassivasRaw.length > 10 && (
                            <TextField
                                type="number"
                                label="Itens por página"
                                value={itemsPerPagePassivo}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 1 && value <= 100) {
                                        setItemsPerPagePassivo(value);
                                        setPagePassivo(1); // Reset to first page
                                    }
                                }}
                                inputProps={{
                                    min: 1,
                                    max: 100,
                                }}
                                size="small"
                                sx={{ width: 150 }}
                            />
                        )}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {partesPassivasPaginated.data.map((parte) => (
                            <Grid item xs={12} sm={6} key={parte.id}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'action.hover',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {parte.nome}
                                        </Typography>
                                        {parte.tipoParte && (
                                            <Chip
                                                label={parte.tipoParte}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                    {parte.documento && (
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            {parte.documento}
                                        </Typography>
                                    )}
                                    {parte.representantes && parte.representantes.length > 0 && (
                                        <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMore />}
                                                sx={{ px: 0, minHeight: 'auto', '&.Mui-expanded': { minHeight: 'auto' } }}
                                            >
                                                <Typography variant="caption" color="text.secondary">
                                                    Representantes ({parte.representantes.length})
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ pt: 0, px: 0 }}>
                                                {parte.representantes.map((rep) => (
                                                    <Typography
                                                        key={rep.id}
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ fontSize: '0.875rem', mb: 0.5 }}
                                                    >
                                                        • {rep.nome} ({rep.tipo})
                                                    </Typography>
                                                ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {partesPassivasRaw.length > 10 && partesPassivasPaginated.totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={partesPassivasPaginated.totalPages}
                                page={pagePassivo}
                                onChange={(_, newPage) => setPagePassivo(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
                </Paper>
            )}

            {/* Tramitação Atual */}
            {process.tramitacaoAtual && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Tramitação Atual
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Órgão Julgador
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {process.tramitacaoAtual.local}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Status
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {process.tramitacaoAtual.status}
                            </Typography>
                        </Grid>
                        {process.dataDistribuicao && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Data de Distribuição
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDate(process.dataDistribuicao)}
                                </Typography>
                            </Grid>
                        )}
                        {process.dataAutuacao && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Data de Autuação
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDate(process.dataAutuacao)}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Histórico de Movimentos */}
            {process.movimentos && Array.isArray(process.movimentos) && process.movimentos.length > 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Histórico de Movimentos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                        {process.movimentos.map((movimento, index) => (
                            <Box
                                key={movimento.id}
                                sx={{
                                    p: 2,
                                    mb: index < process.movimentos.length - 1 ? 2 : 0,
                                    backgroundColor: index === process.movimentos.length - 1 ? 'action.selected' : 'background.paper',
                                    borderLeft: index === process.movimentos.length - 1 ? 4 : 1,
                                    borderColor: index === process.movimentos.length - 1 ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {formatDate(movimento.data)}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {movimento.descricao}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tipo: {movimento.tipo}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
