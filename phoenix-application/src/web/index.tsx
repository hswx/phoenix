import React from 'react';
import ReactDom from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';

const root = document.getElementById("root");
ReactDom.createRoot(root).render(<App />);
