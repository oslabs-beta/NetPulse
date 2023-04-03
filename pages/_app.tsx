import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'

export default function App({ Component, pageProps }: AppProps) {
  
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#5a667e',
      },
      secondary: {
        main: '#7e715a',
      },
      background: {
        default: '#322c35',
        paper: 'rgba(41,36,36,0.94)',
      },
      success: {
        main: '#5a797e',
      },
    },})

  return (<Component {...pageProps} />)
}
