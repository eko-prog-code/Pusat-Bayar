import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext'; // Import UserProvider

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker.register(swUrl).then(registration => {
      console.log('Service Worker registered with scope: ', registration.scope);
    }).catch(error => {
      console.error('Service Worker registration failed: ', error);
    });
  });
}

// Create a root and render the app using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap App with BrowserRouter */}
      <UserProvider>  {/* Wrap App with UserProvider */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
