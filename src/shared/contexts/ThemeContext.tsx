import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    theme: Theme;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-mode';

interface ThemeProviderProps {
    children: ReactNode;
}

const getSystemPreference = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }
    return 'light';
};

export const ThemeContextProvider = ({ children }: ThemeProviderProps) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
            const systemPreference = getSystemPreference();

            console.log('[Theme] Initialization:', {
                savedMode,
                systemPreference,
            });

            if (!savedMode) {
                console.log('[Theme] No saved preference, using system:', systemPreference);
                return systemPreference;
            }

            if (savedMode === systemPreference) {
                console.log('[Theme] Saved preference matches system, using:', savedMode);
                return savedMode;
            }

            console.log('[Theme] Saved preference does not match system, clearing and using system:', systemPreference);
            localStorage.removeItem(THEME_STORAGE_KEY);
            return systemPreference;
        }
        return 'light';
    });

    const [isUserPreference, setIsUserPreference] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(THEME_STORAGE_KEY);
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && !isUserPreference) {
            const systemPreference = getSystemPreference();
            if (mode !== systemPreference) {
                setMode(systemPreference);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && isUserPreference) {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        } else if (typeof window !== 'undefined' && !isUserPreference) {
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved) {
                console.log('[Theme] Clearing saved preference to use system preference');
                localStorage.removeItem(THEME_STORAGE_KEY);
            }
        }
    }, [mode, isUserPreference]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
                if (!isUserPreference) {
                    setMode(e.matches ? 'dark' : 'light');
                }
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
                return () => mediaQuery.removeEventListener('change', handleChange);
            }
            else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
                return () => mediaQuery.removeListener(handleChange);
            }
        }
    }, [isUserPreference]);

    const theme: Theme = useMemo(() => {
        return mode === 'light' ? lightTheme : darkTheme;
    }, [mode]);

    const toggleMode = () => {
        setIsUserPreference(true);
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const setModeWithPreference = (newMode: ThemeMode) => {
        setIsUserPreference(true);
        setMode(newMode);
    };

    const value = useMemo(
        () => ({
            mode,
            theme,
            toggleMode,
            setMode: setModeWithPreference,
        }),
        [mode, theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeContextProvider');
    }
    return context;
};
