import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './reset.css'

export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

const userKey = localStorage.getItem('userKey')

if(userKey) {
  axios.defaults.headers.common.Authorization = `Bearer ${userKey}`
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
