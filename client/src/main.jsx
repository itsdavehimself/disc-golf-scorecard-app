import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';
import { AuthContextProvider } from './context/authContext.jsx';
import { FriendListContextProvider } from './context/friendContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <FriendListContextProvider>
        <App />
      </FriendListContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
