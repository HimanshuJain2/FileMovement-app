import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource/raleway/700.css'
import '@fontsource/roboto/400.css'
import { BrowserRouter as Router } from 'react-router-dom'

const theme = extendTheme({
    styles: {
        global: {
            // styles for the `body`
            body: {
                color: '#006666',
            },
        },
    },
    colors: {
        primary: {
            400: '#006666',
        },
        secondary: {
            400: '#b2d8d8',
        },
        accent: {
            400: '#006666',
        },
    },
    fonts: {
        heading: `'Raleway', sans-serif`,
        body: `'Roboto', sans-serif`,
    },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Router>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </Router>
    </React.StrictMode>
)
