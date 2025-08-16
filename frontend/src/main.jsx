import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import ChatProvider from './context/context.jsx'
axios.defaults.baseURL = "http://localhost:8000"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
        <ChatProvider>
         <App />
        </ChatProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
