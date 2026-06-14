import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const el = document.getElementById('root') as HTMLDivElement;
createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
