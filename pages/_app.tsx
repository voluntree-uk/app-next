import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { auth } from "@auth/supabase";
import "@styles/globals.css";


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

  const theme = extendTheme({
    colors,
    components: {
      Steps,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
