import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import './reset.css'

export const BASE_URL = process.env.REACT_APP_API_URL

const userKey = localStorage.getItem('userKey')

require('axios').default.defaults.headers.common['Authorization'] = `Bearer ${userKey}`

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

