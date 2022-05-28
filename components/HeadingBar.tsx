import { Box } from "@chakra-ui/react";
import React, { ReactElement } from "react";

export default function HeadingBar({ children }: { children: ReactElement }) {
  return (
    <Box
      bg="brand.800"
      borderBottomRightRadius={40}
      borderBottomLeftRadius={40}
    >
      {children}
    </Box>
  );
}
