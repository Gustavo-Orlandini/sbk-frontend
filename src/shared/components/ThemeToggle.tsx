import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleProps {
    mode: 'light' | 'dark';
    onToggle: () => void;
}
export const ThemeToggle = ({ mode, onToggle }: ThemeToggleProps) => {
    return (
        <Tooltip title={mode === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}>
            <IconButton onClick={onToggle} color="inherit" aria-label="toggle theme">
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
        </Tooltip>
    );
};
