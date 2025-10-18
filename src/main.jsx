import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SnackbarProvider } from "notistack";
import AuthProvider from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={4000}
    >
      <App />
    </SnackbarProvider>
  </AuthProvider>
)
