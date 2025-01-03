import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FrappeProvider } from 'frappe-react-sdk'

createRoot(document.getElementById('root')).render(
  <FrappeProvider>
    <App />
  </FrappeProvider>,
)
