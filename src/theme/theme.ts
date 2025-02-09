import { createTheme } from '@mui/material';

const commonThemeProps = {
    typography: {
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h3: {
            fontWeight: 600,
            letterSpacing: '-0.3px',
        },
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.2px',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            letterSpacing: '0.1px',
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            letterSpacing: '0.1px',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    textShadow: '0 0 1px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    letterSpacing: '0.3px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    ...commonThemeProps,
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#1a237e',
            secondary: '#455a64',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
    },
});

export const darkTheme = createTheme({
    ...commonThemeProps,
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: '#000000',
        },
        secondary: {
            main: '#f48fb1',
            light: '#fce4ec',
            dark: '#f06292',
            contrastText: '#000000',
        },
        text: {
            primary: '#e3f2fd',
            secondary: '#b0bec5',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
}); 