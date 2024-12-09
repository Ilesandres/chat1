import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa tu componente principal
import './index.css'; // Opcional: estilos globales

// Seleccionar el elemento del DOM donde se montará la app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
