import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeContextProvider, useThemeMode } from './shared/contexts/ThemeContext';
import { ProcessesListPage } from './features/processes/pages/ProcessesListPage';
import { ProcessDetailPage } from './features/processes/pages/ProcessDetailPage';

function AppContent() {
    const { theme } = useThemeMode();

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/processos" replace />} />
                        <Route path="/processos" element={<ProcessesListPage />} />
                        <Route path="/processos/:id" element={<ProcessDetailPage />} />
                    </Routes>
                </BrowserRouter>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

function App() {
    return (
        <ThemeContextProvider>
            <AppContent />
        </ThemeContextProvider>
    );
}

export default App;
