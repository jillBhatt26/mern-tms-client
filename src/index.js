import React from 'react';
import ReactDOM from 'react-dom/client';
import AppContextProvider from './context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
