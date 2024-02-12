import { createTheme } from "@mui/material";

export const lightModeTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2aaf1e',
            text: {
                primary: '#f6f8ea',
            }
        },
        secondary: {
            main: '#f6f8ea',
        }
    },
});

export const darkModeTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#006400',
            text: {
                primary: '#bdb76b',
            }
        },
    },
});