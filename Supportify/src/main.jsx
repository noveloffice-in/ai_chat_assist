import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FrappeProvider } from 'frappe-react-sdk'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@emotion/react'
import { store } from './store/store';
import { createTheme } from '@mui/material';

const theme = createTheme({
  // Customize your theme here
});

createRoot(document.getElementById('root')).render(
  <FrappeProvider url='http://10.80.4.60:8000/' socketPort='9000'>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </FrappeProvider>
)
