import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const renderApp = () => {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
  }
};

renderApp();
