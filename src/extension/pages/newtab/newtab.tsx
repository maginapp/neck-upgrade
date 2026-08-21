import * as React from 'react';

import { createRoot } from 'react-dom/client';

import '@/extension/mock/chrome';
import { App } from './App';
import '@/styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
