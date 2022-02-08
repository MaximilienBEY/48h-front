import React from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider } from './contexts/Snackbar'
import Routes from './routes'
import "./styles/reset.scss"

ReactDOM.render(<SnackbarProvider>
    <Routes />
</SnackbarProvider>, document.getElementById('root'))