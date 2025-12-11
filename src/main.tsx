import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Version without StrictMode for testing duplicate requests issue
// Use this file temporarily if you want to disable StrictMode

createRoot(document.getElementById('root')!).render(
    <App />
)
