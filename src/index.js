import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Bungkus App dengan BrowserRouter */}
      <UserProvider>  {/* Bungkus App dengan UserProvider */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);