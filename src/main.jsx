/**
 * @module main
 * @description Client-side entry point for the React application.
 * Initializes the React root and renders the App component within StrictMode.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
