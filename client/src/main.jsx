import React from 'react'
import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CategoriesProvider } from './context/CategoriesContext'

import { initPWA } from './utils/pwa'

// Initialize PWA features
initPWA()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CategoriesProvider>

        <App />

      </CategoriesProvider>
    </AuthProvider>
  </React.StrictMode>,
)
