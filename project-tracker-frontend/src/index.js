import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// 1️⃣ Minty theme CSS
import 'bootswatch/dist/minty/bootstrap.min.css';
// 2️⃣ Bootstrap JS (includes Toast, Collapse, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
