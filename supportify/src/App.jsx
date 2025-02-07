import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import Router from "../src/routes/Router";

import {
    baselightTheme,
    cyanTheme,
    blueTheme,
    purpleTheme,
    darkTheme,
    amberTheme,
    pinkTheme,
    redTheme,
} from "./theme/DefaultColors";
import { useSelector } from "react-redux";

// Add env file (Example):
// VITE_FRAPPE_URL="http://localhost:8000"
// VITE_FRAPPE_SOCKET="9000"
// VITE_NODE_SOCKET="http://localhost:4040"

const themeMap = {
    default: baselightTheme,
    cyan: cyanTheme,
    blue: blueTheme,
    purple: purpleTheme,
    dark: darkTheme,
    amber: amberTheme,
    pink: pinkTheme,
    red: redTheme,
};

function App() {
    const routing = useRoutes(Router);

    // State for theme selection
    const [theme, setTheme] = useState(baselightTheme);
    const themeFromRedux = useSelector((state) => state.settingsReducer.theme);

    useEffect(() => {
        const selectedTheme = themeMap[themeFromRedux] || baselightTheme;
        setTheme(selectedTheme);
    }, [themeFromRedux]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {routing}
        </ThemeProvider>
    );
}

export default App;
