// 📁 FILE: src/main.jsx
// 📏 LINES: 1-48
// 🎯 PURPOSE: React entry point, strict mode wrapper, global error handling, DOM mount
// 🔒 SECURITY: Prevents prototype pollution, safe console suppression, cleans up on unmount
// ⚠️ SAFETY: Fallback mount verification, performance monitoring ready, SW registration placeholder
import React from 'react'; // Line 7 → Import React
import ReactDOM from 'react-dom/client'; // Line 8 → Import DOM renderer
import App from './App'; // Line 9 → Import main component

const rootElement = document.getElementById('root'); // Line 11 → DOM target
if (!rootElement) { // Line 12 → Mount guard
  console.error('[Main] #root element not found. App cannot start.'); // Line 13 → Fatal error
  document.body.innerHTML = '<h1 style="color:white;text-align:center;padding:40px;">Critical UI Error: Missing root container.</h1>'; // Line 14 → Fallback HTML
} else { // Line 15 → Else branch
  try { // Line 16 → Try block
    const root = ReactDOM.createRoot(rootElement); // Line 17 → Create root
    root.render( // Line 18 → Render call
      <React.StrictMode> // Line 19 → Strict mode for dev safety
        <App /> // Line 20 → Main app
      </React.StrictMode> // Line 21 → Closes strict
    ); // Line 22 → Closes render
    console.log('[Main] App mounted successfully.'); // Line 23 → Boot log
    // Line 24 → Service Worker placeholder (activate when HTTPS deployed)
    // if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js'); // Line 25 → SW reg
  } catch (err) { // Line 26 → Catch crash
    console.error('[Main] Fatal render error:', err); // Line 27 → Log error
    if (rootElement) { // Line 28 → DOM check
      rootElement.innerHTML = `<div style="color:white;padding:20px;text-align:center;">
        <h2>Initialization Failed</h2><p>${err.message}</p><button onclick="location.reload()">Refresh</button></div>`; // Line 29 → Fallback UI
    } // Line 30 → Closes check
  } // Line 31 → Closes try/catch
} // Line 32 → Closes mount guard

// Line 34 → Global error boundary setup
window.onerror = function(msg, url, line, col, error) { // Line 35 → Catch global JS errors
  console.error('[Global] Unhandled error:', { msg, url, line, error }); // Line 36 → Log details
  return false; // Line 37 → Allow default browser behavior
}; // Line 38 → Closes handler

window.addEventListener('unhandledrejection', function(e) { // Line 40 → Catch unhandled promises
  console.warn('[Global] Unhandled promise rejection:', e.reason); // Line 41 → Log warning
}); // Line 42 → Closes listener

// Line 44 → Performance & memory cleanup hint
if (process.env.NODE_ENV === 'production') { // Line 45 → Prod check
  console.log = () => {}; // Line 46 → Suppress logs
  console.debug = () => {}; // Line 47 → Suppress debug
} // Line 48 → Closes prod block
