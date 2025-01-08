import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import Router from "../src/routes/Router";

import { baselightTheme } from "./theme/DefaultColors";
import SocketConnection from "./components/shared/SocketConnection";

//Add env file (Example):
// VITE_FRAPPE_URL="http://localhost:8000"
// VITE_FRAPPE_SOCKET="9000"
// VITE_NODE_SOCKET="http://localhost:4040"

function App() {
    const routing = useRoutes(Router);
    const theme = baselightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SocketConnection>{routing}</SocketConnection>
        </ThemeProvider>
    );
}

export default App;
