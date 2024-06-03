import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'
import './styles/utils.css'

// Only initialize eruda in development mode
if (process.env.NODE_ENV !== 'production') {
  const eruda = require('eruda');
  eruda.init();
}

// Use BrowserRouter to enable client-side routing
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
