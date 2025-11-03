import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme()`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

export default function setupTheme() {
    return createTheme({
        cssVariables: {
            nativeColor: true,
        },
        palette: {
            primary: {
                main: 'var(--primary-color)',
            },
        },
    });
}