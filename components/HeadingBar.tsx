import { Box, Flex } from "@chakra-ui/react";
import React, { ReactElement } from "react";

export default function HeadingBar({ children }: { children: ReactElement }) {
  return (
    <Flex
      alignItems={"center"}
      bg="brand.800"
      display={{ base: "inherit", md: "none", lg: "none" }}
    >
      {children}
    </Flex>
  );
}
