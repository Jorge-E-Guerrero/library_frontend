"use client";

import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function setupTheme({ children }: { children: React.ReactNode }) {


    const theme = createTheme({
        cssVariables: {
            nativeColor: true,
        },
        palette: {
            primary: {
                main: 'var(--primary-color)',
            },
            secondary: {
                main: 'var(--secondary-color)',
            },
        }
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}