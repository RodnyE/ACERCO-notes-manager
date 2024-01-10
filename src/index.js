
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'
import './styles/utils.css'

if (process.env.NODE_ENV !== "production") {
    require('eruda').init()
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);