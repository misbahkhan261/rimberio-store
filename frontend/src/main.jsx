import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';

// - DOM ke root element ko target karke poori React application ko browser mein render kar raha hai
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* - App component poori website ka core structure hai */}
        <App />
    </React.StrictMode>
);