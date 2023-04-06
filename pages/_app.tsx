import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#212529",
      },
      secondary: {
        main: "#212529",
      },
      background: {
        default: "#212529",
        paper: "#212529",
      },
      success: {
        main: "#212529",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
