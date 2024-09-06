import './bootstrap';
import '../css/app.css';

import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@mui/material";

TimeAgo.addDefaultLocale(en)

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const theme = createTheme({
        typography: {
            "fontFamily": `"JetBrains Mono", monospace`,
        },
        palette: {
            primary: {
                main: '#4f46e5'
            },
            secondary: {
                main: '#92ff53',
            },
        }
    }
);


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({el, App, props}) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
