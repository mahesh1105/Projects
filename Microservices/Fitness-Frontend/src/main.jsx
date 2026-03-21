import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AuthProvider } from 'react-oauth2-code-pkce'

import App from './App'
import { store } from './store/store'
import { authConfig } from './authConfig'
import { appTheme } from './theme'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authConfig={authConfig}>
        <Provider store={store}>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
