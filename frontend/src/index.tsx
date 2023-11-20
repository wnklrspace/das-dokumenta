// import React from 'react';
import ReactDOM from 'react-dom/client'
import { GeistProvider } from '@geist-ui/core'
import App from './App'
import UserProvider from './store/UserProvider'
import GlobalStyles from './GlobalStyles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <GeistProvider>
    <UserProvider>
      <GlobalStyles />
      <App />
    </UserProvider>
  </GeistProvider>
)
