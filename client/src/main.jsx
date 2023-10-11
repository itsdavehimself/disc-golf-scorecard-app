import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';
import { AuthContextProvider } from './context/authContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
);
