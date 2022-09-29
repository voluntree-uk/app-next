import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";
import { auth } from "../shared/auth/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#4A43EC",
    700: "#5c56eeF0",
  },
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  auth.updateCookieOnAuthChange();

  const theme = extendTheme({ colors });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
