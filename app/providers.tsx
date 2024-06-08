"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#4A43EC",
    700: "#5c56eeF0",
  },
};
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({colors});
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
