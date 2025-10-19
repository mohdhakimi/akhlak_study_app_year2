/**
 * Application Entry Point - Akhlak Tahun Dua KSRI
 * 
 * This file serves as the entry point for the React application.
 * It initializes the React DOM and renders the main App component
 * with React StrictMode for enhanced development debugging.
 * 
 * Key responsibilities:
 * - Mount the React application to the DOM
 * - Enable React StrictMode for better development experience
 * - Import global CSS styles
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create React root and render the application
// Uses React 18's createRoot API for better performance
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 
      React StrictMode enables additional checks and warnings for:
      - Identifying components with unsafe lifecycles
      - Warning about legacy string ref API usage
      - Warning about deprecated findDOMNode usage
      - Detecting unexpected side effects
      - Detecting legacy context API
    */}
    <App />
  </React.StrictMode>
)
