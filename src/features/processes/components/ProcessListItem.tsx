import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ProcessListItem as ProcessListItemType } from '../types';
import { formatDateOnly } from '../utils/dateUtils';

interface ProcessListItemProps {
    process: ProcessListItemType;
}

export const ProcessListItem = ({ process }: ProcessListItemProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/processos/${process.numero}`);
    };

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                },
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        {process.numero}
                    </Typography>
                    <Chip
                        label={process.grau}
                        size="small"
                        color={
                            process.grau === 'PRIMEIRO'
                                ? 'primary'
                                : process.grau === 'SEGUNDO'
                                    ? 'secondary'
                                    : 'warning'
                        }
                    />
                </Box>

                <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Tribunal:{' '}
                        <Typography component="span" variant="body2" fontWeight="bold">
                            {process.tribunal}
                        </Typography>
                    </Typography>
                </Box>

                <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Classe:{' '}
                        <Typography component="span" variant="body2" fontWeight="bold">
                            {process.classePrincipal}
                        </Typography>
                    </Typography>
                </Box>

                <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Assunto:{' '}
                        <Typography component="span" variant="body2" fontWeight="bold">
                            {process.assuntoPrincipal}
                        </Typography>
                    </Typography>
                </Box>

                {process.ultimoMovimento && (
                    <Box
                        mt={2}
                        p={1.5}
                        sx={{
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" display="block">
                            Último movimento:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {formatDateOnly(process.ultimoMovimento.data)} - {process.ultimoMovimento.descricao}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
