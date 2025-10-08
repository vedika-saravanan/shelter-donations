/**
 * main.tsx
 * ----------
 * Entry point for the Shelter Donations React application.
 * 
 * Responsibilities:
 *  - Mounts the root React component (`App`) to the DOM.
 *  - Wraps the app in `React.StrictMode` for highlighting potential issues.
 * 
 * This file serves as the starting point for the Vite + React frontend,
 * linking index.html → main.tsx → App.tsx.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

/**
 * Initialize and render the root React application.
 * 
 * `React.StrictMode` helps detect side effects, legacy patterns,
 * and other potential issues during development (no effect in production).
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
